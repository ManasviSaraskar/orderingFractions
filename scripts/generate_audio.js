import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env variables from .env.local or .env
function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env')
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
          } else if (val.startsWith("'") && val.endsWith("'")) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// Define all the phrases to narrate
const phrases = [
  // Intro Screen
  { text: "Let's explore fractions and save the Crystal Castle!", style: 'statement' },
  { text: "Learn to order fractions, solve the mystery of the scrambled stones, and defeat Grumble the Troll!", style: 'statement' },

  // Wonder Phase Questions
  { text: "Grumble has scrambled the fraction stones on the path! Can you tell which is the biggest?", style: 'question' },
  { text: "When we compare fractions, we need to look at their numerator AND denominator!", style: 'statement' },
  { text: "Sarah ate ½ of a pizza. Mike ate ¾. Who ate more — and how do you know?", style: 'question' },
  { text: "Ordering fractions helps us compare amounts without guessing!", style: 'statement' },
  { text: "There are 3 magic gates: 1/4, 3/4, and 1/2. Which gate comes last on the path?", style: 'question' },
  { text: "Ordering fractions on a number line shows us exactly where each one lives!", style: 'statement' },
  { text: "If you split a chocolate bar into 8 pieces and eat 3, is that more or less than ½?", style: 'question' },
  { text: "Fractions are everywhere — and knowing their order is a superpower!", style: 'statement' },
  { text: "Hmm… I wonder…", style: 'thinking' },

  // Story Phase
  { text: "Sarah runs into Fraction Forest with her friends. 'Oh no!' she shouts. 'Grumble has mixed up all the fraction stones! We need to put them back in order or the Crystal Castle will be locked forever!'", style: 'statement' },
  { text: "Mike trips over fraction stones labelled 1/6, 4/6, 2/6, 5/6. 'These all have the same bottom number!' says Priya. 'That means we just look at the top!'", style: 'statement' },
  { text: "They reach a tall tower with stones 1/2, 1/4, 1/8. 'They ALL have 1 on top,' says Leon. Zara smiles: 'Bigger bottom means tinier piece! Think of pizza slices.'", style: 'statement' },
  { text: "Grumble throws a mixed set at them: 3/4, 1/2, 2/3. 'Now what?!' cries Mike. Priya pulls out a number line: 'We compare them to 1/2 or use the same denominator!'", style: 'statement' },
  { text: "Now you know how to order all the fraction stones! Let's step into the simulations and practice placing these stones in the right order to unlock the gates.", style: 'statement' },

  // Simulate Phase
  { text: "Explore and discover — interact with the fractions!", style: 'instruction' },
  { text: "Drag the fractions to order them from smallest to largest!", style: 'instruction' },
  { text: "Change the number of slices to see what happens to the size of each piece!", style: 'instruction' },
  { text: "Tap a fraction, then tap its spot on the number line!", style: 'instruction' },

  // Play Phase
  { text: "You must answer Grumble's riddles to unlock each gate!", style: 'instruction' },
  { text: "Remember what you learned in the simulations!", style: 'encouragement' },
  { text: "Look carefully at the numerators and denominators!", style: 'encouragement' },

  // Reflect Phase
  { text: "Can you help me? If two fractions have the same denominator, how do we know which is bigger?", style: 'question' },
  { text: "Can you help me? What happens when you cut a pizza into MORE slices?", style: 'question' },
  { text: "Can you help me? How can you tell if 3/4 is bigger than 1/2?", style: 'question' },
  { text: "How do you feel about ordering fractions?", style: 'question' },
  { text: "You have unlocked the Crystal Castle and defeated Grumble!", style: 'celebration' },
  { text: "Incredible! We saved the Crystal Castle together!", style: 'celebration' }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_]+/g, '_')   // replace spaces/underscores with single _
    .substring(0, 40);         // limit length
}

// A minimal valid 1-second silent MP3 buffer to use as fallback/mock
const MOCK_MP3 = Buffer.from([
  0xFF, 0xFB, 0x12, 0xC4, 0x00, 0x00, 0x00, 0x03, 0x48, 0x00, 0x00, 0x00, 0x00, 0x4C, 0x41, 0x4D,
  0x45, 0x33, 0x2E, 0x39, 0x38, 0x2E, 0x34, 0x00
]);

async function generate() {
  const audioDir = path.resolve(__dirname, '../public/assets/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log(`Starting audio generation... API Key configured: ${!!API_KEY}`);
  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    const { text, style } = phrase;
    const slug = slugify(text);
    const filename = `audio_${slug}_${i}.mp3`;
    const relativePath = `/assets/audio/${filename}`;
    const destPath = path.join(audioDir, filename);

    audioMap[text] = relativePath;

    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 24) {
        console.log(`[SKIPPED] "${text}" already exists and is not a mock file.`);
        continue;
      }
    }

    if (!API_KEY) {
      console.log(`[MOCK] "${text}" -> writing mock silent mp3`);
      fs.writeFileSync(destPath, MOCK_MP3);
      continue;
    }

    const settings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

    try {
      console.log(`[REQUEST] "${text}" (${style})...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: settings.stability,
            similarity_boost: settings.similarity_boost,
            style: settings.style,
            use_speaker_boost: settings.use_speaker_boost
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`[SUCCESS] Saved ${filename}`);

      // Rate limit to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`[ERROR] Failed to generate "${text}":`, err.message);
      console.log(`[FALLBACK] Writing mock silent mp3 for "${text}"`);
      fs.writeFileSync(destPath, MOCK_MP3);
    }
  }

  // Write src/utils/audioMap.js
  const mapPath = path.resolve(__dirname, '../src/utils/audioMap.js');
  const mapContent = `// Automatically generated by scripts/generate_audio.js. Do not edit manually.
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  fs.writeFileSync(mapPath, mapContent, 'utf-8');
  console.log(`Audio mapping written successfully to ${mapPath}`);
}

generate().catch(err => {
  console.error('Generation pipeline crashed:', err);
  process.exit(1);
});
