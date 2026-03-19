import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';

initializeCanvas(createCanvas);

const filePath = 'c:/Users/gurud/nextjs_task/IN/wedding-addons-tamilnadu/public/storage/templates/handfan1-gtfygh.psd';

async function dumpStructure() {
    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });
    
    const simplify = (item) => ({
        name: item.name,
        type: item.children ? 'group' : 'layer',
        visible: !item.hidden,
        mask: !!item.mask,
        maskCanvas: !!(item.mask && item.mask.canvas),
        vectorMask: !!item.vectorMask,
        clipping: !!item.clipping,
        blendMode: item.blendMode,
        opacity: item.opacity,
        left: item.left,
        top: item.top,
        right: item.right,
        bottom: item.bottom,
        children: item.children ? item.children.map(simplify) : undefined
    });

    const structure = simplify(psd);
    fs.writeFileSync('psd_structure.json', JSON.stringify(structure, null, 2));
    console.log('Saved psd_structure.json');
}

dumpStructure();
