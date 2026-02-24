import { readPsd } from 'ag-psd';
import * as fabric from 'fabric';

export interface PsdLayerData {
    name?: string;
    type: 'text' | 'image' | 'group';
    object: fabric.Object;
}

/**
 * Parses a PSD file and returns an array of Fabric.js objects representing its layers.
 * Currently supports Text and Image layers.
 */
export async function parsePsdToFabric(file: File | ArrayBuffer): Promise<fabric.Object[]> {
    let buffer: ArrayBuffer;
    if (file instanceof File) {
        buffer = await file.arrayBuffer();
    } else {
        buffer = file;
    }

    const psd = readPsd(buffer, { skipThumbnail: true });
    const fabricObjects: fabric.Object[] = [];

    if (!psd.children) return [];

    // Recursive function to process layers
    const processLayers = async (children: any[], parentX = 0, parentY = 0) => {
        for (const child of children) {
            if (child.hidden) continue;

            const layerX = (child.left || 0) + parentX;
            const layerY = (child.top || 0) + parentY;

            if (child.children) {
                // Group/Folder handling
                await processLayers(child.children, layerX, layerY);
            } else if (child.text) {
                // Text Layer
                const textObj = new fabric.IText(child.text.text || '', {
                    left: layerX,
                    top: layerY,
                    fontSize: child.text.style?.fontSize || 20,
                    fill: child.text.style?.fillColor ?
                        `rgb(${child.text.style.fillColor.r}, ${child.text.style.fillColor.g}, ${child.text.style.fillColor.b})` :
                        '#000000',
                    fontFamily: child.text.style?.font?.name || 'sans-serif',
                });
                fabricObjects.push(textObj);
            } else if (child.canvas) {
                // Pixel/Image Layer
                const dataUrl = child.canvas.toDataURL();
                const img = await fabric.FabricImage.fromURL(dataUrl);
                img.set({
                    left: layerX,
                    top: layerY,
                });
                fabricObjects.push(img);
            }
        }
    };

    await processLayers(psd.children);
    return fabricObjects;
}
