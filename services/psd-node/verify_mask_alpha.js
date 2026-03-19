import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';

initializeCanvas(createCanvas);

const filePath = 'c:/Users/gurud/nextjs_task/IN/wedding-addons-tamilnadu/public/storage/templates/handfan1-gtfygh.psd';

async function verifyMaskAlpha() {
    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer, { skipLayerImageData: false });
    
    const findLayer = (children) => {
        for (const child of children) {
            if (child.name === 'Layer 1') return child;
            if (child.children) {
                const found = findLayer(child.children);
                if (found) return found;
            }
        }
        return null;
    };

    const layer = findLayer(psd.children);
    if (!layer || !layer.mask || !layer.mask.canvas) {
        console.log('No mask canvas found');
        return;
    }

    const maskCtx = layer.mask.canvas.getContext('2d');
    const imageData = maskCtx.getImageData(0, 0, layer.mask.canvas.width, layer.mask.canvas.height);
    const data = imageData.data;

    let hasNonZeroAlpha = false;
    let hasTransparency = false;
    let hasGrayscaleInfo = false;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i+3] < 255) hasTransparency = true;
        if (data[i] !== data[i+1] || data[i] !== data[i+2]) {
            // Not grayscale?
        }
        if (data[i] < 255) hasGrayscaleInfo = true;
    }

    console.log(`Mask Analysis for ${layer.name}:`);
    console.log(`- Has Transparency (Alpha < 255): ${hasTransparency}`);
    console.log(`- Has Grayscale Content (Red < 255): ${hasGrayscaleInfo}`);
    console.log(`- Sample Pixels (R,G,B,A):`);
    for(let j=0; j<10; j++) {
        const offset = Math.floor(data.length / 2) + j * 4;
        console.log(`  [${j}] ${data[offset]}, ${data[offset+1]}, ${data[offset+2]}, ${data[offset+3]}`);
    }
}

verifyMaskAlpha();
