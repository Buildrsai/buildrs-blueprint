/**
 * Test Gemini Image Generation via Google AI Studio
 * Usage: node test-gemini.mjs
 *
 * Lit GOOGLE_AI_API_KEY depuis .env.local (blueprint-app)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Lire la clé depuis .env.local
function loadEnv() {
  const envPath = resolve(__dirname, '../blueprint-app/.env.local');
  const raw = readFileSync(envPath, 'utf-8');
  const lines = raw.split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key?.trim() === 'GOOGLE_AI_API_KEY') {
      return rest.join('=').trim();
    }
  }
  throw new Error('GOOGLE_AI_API_KEY introuvable dans .env.local');
}

const API_KEY = loadEnv();
const MODEL = 'imagen-3.0-generate-001';
const LIST_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

// Prompt test — visuel ad pour Buildrs Blueprint
const PROMPT = `
Create a high-converting Facebook/Instagram ad image for a digital product called "Buildrs Blueprint".
Style: clean, premium, modern dark background, white text, minimal design.
Show: a dashboard UI mockup with "Build your MVP in 72h" as headline.
Aspect ratio: 1:1 (1024x1024). No stock photo feel — bold graphic design.
`;

async function listImageModels() {
  console.log('📋 Listing modèles disponibles...\n');
  const res = await fetch(LIST_URL);
  const data = await res.json();
  const models = data.models ?? [];
  const imageModels = models.filter(
    (m) => m.name.includes('imagen') || m.name.includes('image') || m.supportedGenerationMethods?.includes('predict')
  );
  console.log('Modèles image trouvés :');
  imageModels.forEach((m) => console.log(` - ${m.name}  (${m.displayName})`));
  console.log('');
  return imageModels;
}

async function generateImage() {
  console.log('🎨 Génération image avec Imagen 3...');
  console.log(`Modèle : ${MODEL}`);
  console.log(`Prompt : ${PROMPT.trim().slice(0, 80)}...\n`);

  // Imagen 3 utilise l'endpoint "predict" (pas generateContent)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: PROMPT.trim() }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    // Si 404, lister les modèles pour aider au diagnostic
    await listImageModels();
    throw new Error(`API Error ${response.status}: ${err}`);
  }

  const data = await response.json();

  // Imagen retourne predictions[].bytesBase64Encoded
  const prediction = data.predictions?.[0];
  if (!prediction?.bytesBase64Encoded) {
    console.log('Réponse complète :', JSON.stringify(data, null, 2));
    throw new Error('Aucune image dans la réponse');
  }

  const outPath = resolve(__dirname, 'test-output.png');
  writeFileSync(outPath, Buffer.from(prediction.bytesBase64Encoded, 'base64'));

  console.log(`✅ Image sauvegardée : ${outPath}`);
  console.log(`   Taille : ${Math.round(prediction.bytesBase64Encoded.length * 0.75 / 1024)} KB`);
}

// Lance d'abord le listing si on veut diagnostiquer, sinon génère directement
generateImage().catch(async (err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
