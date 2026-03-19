import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

initializeCanvas(createCanvas);

const filePath = 'c:/Users/gurud/nextjs_task/IN/wedding-addons-tamilnadu/public/storage/templates/handfan1-gtfygh.psd';

async function diagnose() {
    console.log(`Diagnosing: ${filePath}`);
    try {
        if (!fs.existsSync(filePath)) {
            console.error('File does not exist!');
            return;
        }

        const stats = fs.statSync(filePath);
        console.log(`File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

        const buffer = fs.readFileSync(filePath);
        console.log('Reading PSD...');
        const psd = readPsd(buffer);
        
        console.log('PSD Metadata:');
        console.log(`- Width: ${psd.width}`);
        console.log(`- Height: ${psd.height}`);
        console.log(`- Channels: ${psd.channels}`);
        console.log(`- Color Mode: ${psd.colorMode}`);
        console.log(`- Has Composite Canvas: ${psd.canvas ? 'Yes' : 'No'}`);
        if (psd.canvas) {
            console.log(`- Composite Size: ${psd.canvas.width}x${psd.canvas.height}`);
        }
        console.log(`- Layer Count: ${psd.children ? psd.children.length : 0}`);

        function inspectLayers(children, indent = '') {
            if (!children) return;
            children.forEach((layer, index) => {
                console.log(`${indent}Layer ${index}:`);
                console.log(`${indent}  - Name: ${layer.name}`);
                console.log(`${indent}  - Visible: ${layer.hidden ? 'No' : 'Yes'}`);
                console.log(`${indent}  - Type: ${layer.children ? 'Group' : 'Layer'}`);
                console.log(`${indent}  - Clipping: ${layer.clipping ? 'Yes' : 'No'}`);
                console.log(`${indent}  - Opacity: ${layer.opacity}`);
                console.log(`${indent}  - Blend Mode: ${layer.blendMode}`);
                console.log(`${indent}  - Has Canvas: ${layer.canvas ? 'Yes' : 'No'}`);
                console.log(`${indent}  - Has Mask: ${layer.mask ? 'Yes' : 'No'}`);
                if (layer.mask) {
                    console.log(`${indent}    - Mask Size: ${layer.mask.width}x${layer.mask.height}`);
                    console.log(`${indent}    - Mask Position: ${layer.mask.left},${layer.mask.top}`);
                    console.log(`${indent}    - Mask Has Canvas: ${layer.mask.canvas ? 'Yes' : 'No'}`);
                }
                console.log(`${indent}  - Has Vector Mask: ${layer.vectorMask ? 'Yes' : 'No'}`);
                if (layer.canvas) {
                    console.log(`${indent}  - Canvas Size: ${layer.canvas.width}x${layer.canvas.height}`);
                }
                if (layer.children) {
                    inspectLayers(layer.children, indent + '  ');
                }
            });
        }

        if (psd.children) {
            inspectLayers(psd.children);
        }

        if (psd.colorMode === 4) { // CMYK
            console.warn('⚠️ WARNING: CMYK Color Mode detected. ag-psd/canvas might have issues with CMYK.');
        }

    } catch (error) {
        console.error('❌ Parsing Error:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

diagnose();
