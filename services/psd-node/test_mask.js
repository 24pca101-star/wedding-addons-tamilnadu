import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';
import sharp from 'sharp';

initializeCanvas(createCanvas);

const filePath = 'c:/Users/gurud/nextjs_task/IN/wedding-addons-tamilnadu/public/storage/templates/handfan1-gtfygh.psd';

async function testMask() {
    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer, { skipLayerImageData: false });
    
    // Find the "Layer 1" which has a mask and canvas
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
    if (!layer || !layer.canvas || !layer.mask || !layer.mask.canvas) {
        console.log('Layer not found or missing mask/canvas');
        return;
    }

    console.log(`Testing mask for: ${layer.name}`);
    console.log(`Layer: pos(${layer.left}, ${layer.top}) size(${layer.canvas.width}x${layer.canvas.height})`);
    console.log(`Mask: pos(${layer.mask.left}, ${layer.mask.top}) size(${layer.mask.canvas.width}x${layer.mask.canvas.height})`);

    const maskedCanvas = createCanvas(layer.canvas.width, layer.canvas.height);
    const mCtx = maskedCanvas.getContext('2d');

    mCtx.drawImage(layer.canvas, 0, 0);

    const mLeft = (layer.mask.left || 0) - (layer.left || 0);
    const mTop = (layer.mask.top || 0) - (layer.top || 0);
    console.log(`Draw Mask at: ${mLeft}, ${mTop}`);

    mCtx.globalCompositeOperation = 'destination-in';
    mCtx.drawImage(layer.mask.canvas, mLeft, mTop);

    const outputBuffer = maskedCanvas.toBuffer('image/png');
    fs.writeFileSync('mask_test_output.png', outputBuffer);
    console.log('Saved mask_test_output.png');
}

testMask();
