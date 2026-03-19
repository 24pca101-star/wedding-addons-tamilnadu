import fs from 'fs';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import path from 'path';

initializeCanvas(createCanvas);

async function diagnose() {
    const filename = 'design-1.psd';
    const filePath = path.resolve(process.cwd(), '../../public/storage/templates', filename);
    
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });

    console.log(`PSD Dimensions: ${psd.width}x${psd.height}`);
    console.log(`Top-level children (${psd.children.length}):`);
    
    psd.children.forEach((c, i) => {
        console.log(`[${i}] ${c.name} ${c.children ? `(Group, ${c.children.length} children)` : '(Layer)'}`);
        if (c.children) {
            c.children.forEach((cc, ii) => {
                console.log(`  [${ii}] ${cc.name} ${cc.children ? '(Nested Group)' : '(Layer)'}`);
            });
        }
    });
}

diagnose();
