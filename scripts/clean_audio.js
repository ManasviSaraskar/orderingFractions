import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { audioMap } from '../src/utils/audioMap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function clean() {
  const audioDir = path.resolve(__dirname, '../public/assets/audio');
  if (!fs.existsSync(audioDir)) {
    console.log('Audio directory does not exist. Nothing to clean.');
    return;
  }

  console.log('Starting audio cleanup...');
  const referencedFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));
  const files = fs.readdirSync(audioDir);

  let deletedCount = 0;

  for (const file of files) {
    if (file.endsWith('.mp3') && !referencedFiles.has(file)) {
      const filePath = path.join(audioDir, file);
      fs.unlinkSync(filePath);
      console.log(`[DELETED] Orphaned audio file: ${file}`);
      deletedCount++;
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedCount} unused audio files.`);
}

clean();
