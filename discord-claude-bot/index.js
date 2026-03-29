require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Anthropic = require('@anthropic-ai/sdk').default;
const { registerCommands } = require('./commands');
const { ConversationManager } = require('./conversation');

// ─── Config ────────────────────────────────────────────────────────────────────
const CONFIG = {
  discordToken: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  claudeChannelId: process.env.CLAUDE_CHANNEL_ID,
  model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
  maxHistory: parseInt(process.env.MAX_HISTORY || '20', 10),
  systemPrompt: process.env.SYSTEM_PROMPT || 'Tu es Claude, un assistant IA intégré dans Discord. Réponds de manière concise et utile.',
};

// Validate config
for (const [key, val] of Object.entries(CONFIG)) {
  if (!val && key !== 'maxHistory') {
    console.error(`❌ Missing env variable: ${key}`);
    process.exit(1);
  }
}

// ─── Clients ───────────────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: CONFIG.anthropicKey });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const conversations = new ConversationManager(CONFIG.maxHistory);

// ─── Helpers ───────────────────────────────────────────────────────────────────
const MAX_DISCORD_LENGTH = 2000;

function splitMessage(text) {
  if (text.length <= MAX_DISCORD_LENGTH) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_DISCORD_LENGTH) {
      chunks.push(remaining);
      break;
    }

    // Try to split at a code block boundary, newline, or space
    let splitAt = MAX_DISCORD_LENGTH;
    const codeBlockIdx = remaining.lastIndexOf('\n```', MAX_DISCORD_LENGTH);
    const newlineIdx = remaining.lastIndexOf('\n', MAX_DISCORD_LENGTH);
    const spaceIdx = remaining.lastIndexOf(' ', MAX_DISCORD_LENGTH);

    if (codeBlockIdx > MAX_DISCORD_LENGTH * 0.5) {
      splitAt = codeBlockIdx;
    } else if (newlineIdx > MAX_DISCORD_LENGTH * 0.5) {
      splitAt = newlineIdx;
    } else if (spaceIdx > 0) {
      splitAt = spaceIdx;
    }

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  return chunks;
}

async function callClaude(userId, userMessage, options = {}) {
  const history = conversations.getHistory(userId);
  history.push({ role: 'user', content: userMessage });

  const params = {
    model: options.model || CONFIG.model,
    max_tokens: options.maxTokens || 4096,
    system: options.systemPrompt || CONFIG.systemPrompt,
    messages: history,
  };

  const response = await anthropic.messages.create(params);
  const assistantMessage = response.content[0].text;

  history.push({ role: 'assistant', content: assistantMessage });
  conversations.setHistory(userId, history);

  return {
    text: assistantMessage,
    usage: response.usage,
    model: response.model,
    stopReason: response.stop_reason,
  };
}

// ─── Chat mode (free conversation in claude channel) ───────────────────────────
client.on('messageCreate', async (message) => {
  // Ignore bots, system messages
  if (message.author.bot) return;
  if (message.system) return;

  // Only respond in the designated claude channel
  if (message.channel.id !== CONFIG.claudeChannelId) return;

  // Ignore messages that start with / (slash commands)
  if (message.content.startsWith('/')) return;

  const userMessage = message.content.trim();
  if (!userMessage) return;

  try {
    await message.channel.sendTyping();

    // Keep typing indicator alive for long responses
    const typingInterval = setInterval(() => {
      message.channel.sendTyping().catch(() => {});
    }, 8000);

    const result = await callClaude(message.author.id, userMessage);

    clearInterval(typingInterval);

    const chunks = splitMessage(result.text);
    for (const chunk of chunks) {
      await message.reply({ content: chunk, allowedMentions: { repliedUser: false } });
    }
  } catch (error) {
    console.error('Error calling Claude:', error);

    const errorEmbed = new EmbedBuilder()
      .setColor(0xff4444)
      .setTitle('Erreur')
      .setDescription(error.message?.includes('rate_limit')
        ? '⏳ Rate limit atteint. Réessaie dans quelques secondes.'
        : `❌ Une erreur est survenue: ${error.message?.slice(0, 200) || 'Erreur inconnue'}`)
      .setTimestamp();

    await message.reply({ embeds: [errorEmbed] });
  }
});

// ─── Slash commands ────────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // ── /ask ──
  if (commandName === 'ask') {
    const question = interaction.options.getString('question');
    await interaction.deferReply();

    try {
      // One-shot, no conversation history
      const response = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 4096,
        system: CONFIG.systemPrompt,
        messages: [{ role: 'user', content: question }],
      });

      const text = response.content[0].text;
      const chunks = splitMessage(text);

      await interaction.editReply({ content: chunks[0] });
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ content: chunks[i] });
      }
    } catch (error) {
      console.error('Error in /ask:', error);
      await interaction.editReply({ content: `❌ Erreur: ${error.message?.slice(0, 200)}` });
    }
  }

  // ── /code ──
  if (commandName === 'code') {
    const prompt = interaction.options.getString('prompt');
    const language = interaction.options.getString('language') || '';
    await interaction.deferReply();

    try {
      const codePrompt = language
        ? `Écris du code en ${language} pour: ${prompt}. Retourne UNIQUEMENT le code dans un bloc markdown, avec des commentaires explicatifs dans le code.`
        : `Écris du code pour: ${prompt}. Retourne UNIQUEMENT le code dans un bloc markdown approprié, avec des commentaires explicatifs dans le code.`;

      const response = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 4096,
        system: 'Tu es un expert en programmation. Tu retournes du code propre, bien commenté et fonctionnel. Utilise des blocs de code markdown.',
        messages: [{ role: 'user', content: codePrompt }],
      });

      const text = response.content[0].text;
      const chunks = splitMessage(text);

      await interaction.editReply({ content: chunks[0] });
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ content: chunks[i] });
      }
    } catch (error) {
      console.error('Error in /code:', error);
      await interaction.editReply({ content: `❌ Erreur: ${error.message?.slice(0, 200)}` });
    }
  }

  // ── /reset ──
  if (commandName === 'reset') {
    conversations.clearHistory(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x00cc88)
      .setTitle('🔄 Conversation réinitialisée')
      .setDescription('Ta mémoire de conversation a été effacée. On repart de zéro !')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // ── /analyse ──
  if (commandName === 'analyse') {
    const text = interaction.options.getString('texte');
    const type = interaction.options.getString('type') || 'général';
    await interaction.deferReply();

    try {
      const analysePrompts = {
        'général': `Analyse le texte suivant de manière approfondie:\n\n${text}`,
        'sentiment': `Fais une analyse de sentiment détaillée du texte suivant. Identifie le ton, les émotions, la polarité (positif/négatif/neutre) et le niveau de confiance:\n\n${text}`,
        'résumé': `Fais un résumé concis et structuré du texte suivant, en identifiant les points clés:\n\n${text}`,
        'stratégie': `Analyse ce texte d'un point de vue stratégique business. Identifie les opportunités, risques, et recommandations:\n\n${text}`,
      };

      const response = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 4096,
        system: 'Tu es un analyste expert. Tu fournis des analyses structurées, précises et actionnables.',
        messages: [{ role: 'user', content: analysePrompts[type] || analysePrompts['général'] }],
      });

      const result = response.content[0].text;
      const chunks = splitMessage(result);

      await interaction.editReply({ content: chunks[0] });
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ content: chunks[i] });
      }
    } catch (error) {
      console.error('Error in /analyse:', error);
      await interaction.editReply({ content: `❌ Erreur: ${error.message?.slice(0, 200)}` });
    }
  }

  // ── /status ──
  if (commandName === 'status') {
    const historyCount = conversations.getHistoryCount(interaction.user.id);
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle('📊 Status du Bot Claude')
      .addFields(
        { name: 'Modèle', value: CONFIG.model, inline: true },
        { name: 'Uptime', value: `${hours}h ${minutes}m`, inline: true },
        { name: 'Messages en mémoire', value: `${historyCount} messages`, inline: true },
        { name: 'Channel Claude', value: `<#${CONFIG.claudeChannelId}>`, inline: true },
        { name: 'Latence API', value: `${client.ws.ping}ms`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Powered by Claude (Anthropic)' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// ─── Ready ─────────────────────────────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`\n✅ Bot connecté en tant que ${client.user.tag}`);
  console.log(`📡 Channel Claude: ${CONFIG.claudeChannelId}`);
  console.log(`🤖 Modèle: ${CONFIG.model}`);
  console.log(`💬 Max historique: ${CONFIG.maxHistory} paires\n`);

  // Register slash commands
  try {
    await registerCommands(CONFIG.clientId, CONFIG.discordToken);
    console.log('✅ Commandes slash enregistrées');
  } catch (error) {
    console.error('❌ Erreur enregistrement commandes:', error);
  }

  // Set activity
  client.user.setActivity('💬 Parle-moi dans #claude', { type: 0 });
});

// ─── Error handling ────────────────────────────────────────────────────────────
client.on('error', (error) => console.error('Discord client error:', error));
process.on('unhandledRejection', (error) => console.error('Unhandled rejection:', error));

// ─── Start ─────────────────────────────────────────────────────────────────────
client.login(CONFIG.discordToken);
