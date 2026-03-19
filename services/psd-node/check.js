import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../../public/storage/templates');
const PREVIEWS_DIR = path.resolve(__dirname, '../../public/storage/previews');

console.log('--- DIAGNOSTICS ---');
console.log('__dirname:', __dirname);
console.log('TEMPLATES_DIR:', TEMPLATES_DIR);
console.log('Exists:', fs.existsSync(TEMPLATES_DIR));

if (fs.existsSync(TEMPLATES_DIR)) {
    console.log('Files in TEMPLATES_DIR:');
    fs.readdirSync(TEMPLATES_DIR).forEach(f => {
        if (f.startsWith('tote-bag-design')) {
            console.log(' -', f);
        }
    });
}

console.log('PREVIEWS_DIR:', PREVIEWS_DIR);
console.log('Exists:', fs.existsSync(PREVIEWS_DIR));

if (fs.existsSync(PREVIEWS_DIR)) {
    console.log('Files in PREVIEWS_DIR:');
    fs.readdirSync(PREVIEWS_DIR).forEach(f => {
        if (f.startsWith('tote-bag-design')) {
            console.log(' -', f);
        }
    });
}
