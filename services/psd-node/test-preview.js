import { generateCleanPreview } from './parser.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = path.resolve(__dirname, '../../public/storage/templates/design-3.psd');
const outputPath = path.resolve(__dirname, '../../public/storage/previews/design-3.png');

console.log(`Generating preview for ${inputPath}...`);

generateCleanPreview(inputPath, outputPath).then(() => {
    console.log(`SUCCESS: Preview generated at ${outputPath}`);
}).catch(err => {
    console.error(`FAILURE: ${err.message}`);
    console.error(err.stack);
});
