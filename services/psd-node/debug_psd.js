
import fs from 'fs';
import path from 'path';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initializeCanvas(createCanvas);

const filePath = path.resolve(__dirname, '../../public/storage/templates/design-6.psd');

try {
    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });
    console.log('PSD Metadata:');
    console.log(`Width: ${psd.width}`);
    console.log(`Height: ${psd.height}`);
    console.log(`Layers count: ${psd.children?.length}`);

    // Check background image file if it exists
    const previewPath = path.resolve(__dirname, '../../public/storage/previews/design-3.png');
    if (fs.existsSync(previewPath)) {
        const stats = fs.statSync(previewPath);
        console.log(`Preview PNG found: ${previewPath}`);
        console.log(`File size: ${stats.size} bytes`);
    } else {
        console.log('Preview PNG NOT found');
    }
} catch (err) {
    console.error('Error reading PSD:', err.message);
}
