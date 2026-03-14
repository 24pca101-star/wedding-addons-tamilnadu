import { generatePreview } from './parser.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../../public/storage/templates');
const PREVIEWS_DIR = path.resolve(__dirname, '../../public/storage/previews');

const testFile = 'design-1.psd';
const inputPath = path.join(TEMPLATES_DIR, testFile);
const outputPath = path.join(PREVIEWS_DIR, testFile.replace('.psd', '.png'));

console.log(`Testing full preview generation for ${testFile}...`);

generatePreview(inputPath, outputPath)
  .then(() => console.log('Success!'))
  .catch(err => {
      console.error('Generation Failed:', err);
      process.exit(1);
  });
