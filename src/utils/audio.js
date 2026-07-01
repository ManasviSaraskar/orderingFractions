import { audioMap } from './audioMap';

// Segment Helpers
export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'encouragement' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function celebrate(text) { return { text, style: 'celebration' }; }
export function instruct(text) { return { text, style: 'instruction' }; }

// Voice settings mapping
const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

let currentAudio = null;
let queueId = 0;
let isAudioEnabled = true;

export function setAudioEnabled(enabled) {
  isAudioEnabled = enabled;
  if (!enabled) {
    stopNarration();
  }
}

// Check cache or dynamic fallback
export async function getAudioUrl(text, style) {
  // 1. Check audio map
  if (audioMap[text]) {
    return audioMap[text];
  }

  const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (audioMap[cleanText]) {
    return audioMap[cleanText];
  }

  // 2. Try ElevenLabs directly if VITE_ELEVENLABS_API_KEY is available
  const apiKey = import.meta.env?.VITE_ELEVENLABS_API_KEY;
  if (apiKey) {
    try {
      const settings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
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

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (e) {
      console.error('Dynamic ElevenLabs fetch failed:', e);
    }
  }

  // Return null so fallback synthesis can be used
  return null;
}

export function stopNarration() {
  queueId++; // Invalidates active queue
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}



export async function narrate(segments, force = true) {
  if (!isAudioEnabled) return;
  if (force) {
    stopNarration();
  }

  const activeQueue = ++queueId;

  // Convert single segment to array if necessary
  const list = Array.isArray(segments) ? segments : [segments];

  for (let i = 0; i < list.length; i++) {
    if (queueId !== activeQueue) return; // Abort if queue was cancelled/replaced

    const segment = list[i];
    if (!segment || !segment.text) continue;

    // Eagerly preload next segment
    if (i + 1 < list.length && list[i + 1]) {
      getAudioUrl(list[i + 1].text, list[i + 1].style).catch(() => {});
    }

    try {
      const url = await getAudioUrl(segment.text, segment.style);
      if (queueId !== activeQueue) return;

      if (url) {
        await new Promise((resolve, reject) => {
          const audio = new Audio(url);
          currentAudio = audio;
          audio.onended = () => {
            currentAudio = null;
            resolve();
          };
          audio.onerror = (e) => {
            currentAudio = null;
            reject(e);
          };
          audio.play().catch(reject);
        });
      } else {
        // No audio available — skip silently (do not fall back to browser voice)
        console.warn('No ElevenLabs audio for:', segment.text);
      }
    } catch (err) {
      console.warn('ElevenLabs playback error, skipping segment:', err);
    }

    // Brief gap between segments
    if (queueId !== activeQueue) return;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}
