import fs from 'fs';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';

initializeCanvas(createCanvas);

async function checkHierarchy() {
    const filename = process.argv[2] || 'traditional-utility-items/printed-visiri-hand-fan/handfan1.psd';
    const filePath = `../../public/storage/templates/${filename}`;
    
    console.log(`Checking hierarchy and clipping for ${filename}...`);
    try {
        const buffer = fs.readFileSync(filePath);
        const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });
        
        function printLayers(item, indent = 0) {
            const prefix = '  '.repeat(indent);
            const isGroup = !!item.children;
            console.log(`${prefix}${isGroup ? '📂' : '📄'} ${item.name || 'Unnamed'} (${isGroup ? 'Group' : 'Layer'}) - visible: ${item.visible !== false}${item.clipping ? ' [CLIPPED]' : ''}`);
            if (item.children) {
                item.children.forEach(child => printLayers(child, indent + 1));
            }
        }
        
        printLayers(psd);
    } catch (e) {
        console.error(e);
    }
}

checkHierarchy();
