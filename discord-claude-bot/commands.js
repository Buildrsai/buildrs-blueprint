const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Pose une question à Claude (sans contexte de conversation)')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Ta question pour Claude')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('code')
    .setDescription('Demande à Claude de générer du code')
    .addStringOption(option =>
      option
        .setName('prompt')
        .setDescription('Décris ce que tu veux coder')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('language')
        .setDescription('Langage de programmation')
        .setRequired(false)
        .addChoices(
          { name: 'JavaScript', value: 'JavaScript' },
          { name: 'TypeScript', value: 'TypeScript' },
          { name: 'Python', value: 'Python' },
          { name: 'Rust', value: 'Rust' },
          { name: 'Go', value: 'Go' },
          { name: 'Java', value: 'Java' },
          { name: 'C#', value: 'C#' },
          { name: 'PHP', value: 'PHP' },
          { name: 'SQL', value: 'SQL' },
          { name: 'Bash', value: 'Bash' },
          { name: 'HTML/CSS', value: 'HTML/CSS' },
          { name: 'React/JSX', value: 'React/JSX' },
        )
    ),

  new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Réinitialise ta conversation avec Claude'),

  new SlashCommandBuilder()
    .setName('analyse')
    .setDescription('Demande à Claude d\'analyser un texte')
    .addStringOption(option =>
      option
        .setName('texte')
        .setDescription('Le texte à analyser')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('Type d\'analyse')
        .setRequired(false)
        .addChoices(
          { name: 'Analyse générale', value: 'général' },
          { name: 'Analyse de sentiment', value: 'sentiment' },
          { name: 'Résumé', value: 'résumé' },
          { name: 'Analyse stratégique', value: 'stratégie' },
        )
    ),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Affiche le status du bot Claude'),
];

async function registerCommands(clientId, token) {
  const rest = new REST({ version: '10' }).setToken(token);

  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands.map(cmd => cmd.toJSON()) }
  );

  console.log(`📝 ${data.length} commandes slash enregistrées globalement`);
  return data;
}

module.exports = { registerCommands, commands };
