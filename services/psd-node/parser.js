import fs from 'fs';
import { readPsd, initializeCanvas } from 'ag-psd';
import sharp from 'sharp';
import { createCanvas } from 'canvas';

// Initialize with node-canvas
initializeCanvas(createCanvas);

/**
 * Robustly extract layer dimensions using right/left/bottom/top
 */
function getLayerDimensions(layer) {
    const left = Math.round(layer.left || 0);
    const top = Math.round(layer.top || 0);
    const right = Math.round(layer.right || 0);
    const bottom = Math.round(layer.bottom || 0);

    const width = Math.round(right - left) || Math.round(layer.width || 0);
    const height = Math.round(bottom - top) || Math.round(layer.height || 0);

    return { x: left, y: top, width, height };
}

/**
 * Parses a PSD file and extracts layer metadata, exporting image layers as PNGs.
 */
export async function parsePsdMetadata(filePath, publicDir = '') {
    try {
        const filename = filePath.split(/[\\/]/).pop();
        const layerStorageDir = publicDir ? `${publicDir}/storage/layers/${filename}` : '';
        if (layerStorageDir && !fs.existsSync(layerStorageDir)) {
            fs.mkdirSync(layerStorageDir, { recursive: true });
        }

        const buffer = fs.readFileSync(filePath);
        // Important: Read WITH image data so we can export layers
        const psd = readPsd(buffer, { skipLayerImageData: false, skipThumbnail: true });

        const layers = [];
        const elements = [];
        let layerCounter = 0;

        async function processLayers(item) {
            if (item.children) {
                // ag-psd children are ordered TOP to BOTTOM.
                for (const child of item.children) {
                    await processLayers(child);
                }
            } else {
                const layerIndex = layerCounter++;
                let layerImageUrl = null;

                // Export image layers
                if (item.canvas && layerStorageDir) {
                    const layerId = `${layerIndex}.png`;
                    const layerPath = `${layerStorageDir}/${layerId}`;
                    const pngBuffer = item.canvas.toBuffer('image/png');
                    await sharp(pngBuffer).toFile(layerPath);
                    layerImageUrl = `/storage/layers/${filename}/${layerId}`;
                }

                const dims = getLayerDimensions(item);
                const isText = item.text != null;

                const layer = {
                    name: item.name,
                    type: isText ? 'text' : 'image',
                    top: dims.y,
                    left: dims.x,
                    width: dims.width,
                    height: dims.height,
                    opacity: item.opacity ?? 1,
                    visible: item.visible !== false,
                    imageUrl: layerImageUrl,
                    text: isText ? {
                        value: item.text.text,
                        font: item.text.fonts?.[0]?.name || 'Inter',
                        size: item.text.fonts?.[0]?.size || 24,
                        color: item.text.colors?.[0] || [0, 0, 0, 255],
                        alignment: item.text.justification || 'left'
                    } : null
                };
                layers.push(layer);

                // Elements array for alternative frontend formats
                elements.push({
                    id: `psd-${elements.length}`,
                    type: layer.type,
                    name: layer.name,
                    content: layer.text?.value || '',
                    x: layer.left,
                    y: layer.top,
                    width: layer.width,
                    height: layer.height,
                    fontSize: layer.text?.size,
                    fontFamily: layer.text?.font,
                    color: layer.text?.color,
                    textAlign: layer.text?.alignment,
                    opacity: layer.opacity,
                    visible: layer.visible
                });
            }
        }

        if (psd.children) {
            for (const child of psd.children) {
                await processLayers(child);
            }
        }

        return {
            width: psd.width,
            height: psd.height,
            realWidth: psd.width,
            realHeight: psd.height,
            layers,
            elements
        };
    } catch (error) {
        console.error(`Metadata Extraction Failed:`, error.message);
        throw error;
    }
}

/**
 * Generates a high-quality "Clean" preview by iterating layers BOTTOM-TO-TOP.
 */
export async function generateCleanPreview(filePath, outputPath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const psd = readPsd(buffer);

        const mainCanvas = createCanvas(psd.width, psd.height);
        const ctx = mainCanvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, psd.width, psd.height);

        console.log(`🎨 Parser: Generating CLEAN background via Robust Layering (PSD: ${psd.width}x${psd.height})`);

        function drawLayers(item, parentVisible = true) {
            const isVisible = parentVisible && item.visible !== false;

            if (item.children) {
                // To draw correctly, iterate REVERSE (BOTTOM to TOP).
                for (let i = item.children.length - 1; i >= 0; i--) {
                    drawLayers(item.children[i], isVisible);
                }
            } else {
                const isText = (item.text != null);
                if (!isText && isVisible && item.canvas) {
                    ctx.globalAlpha = item.opacity ?? 1;
                    ctx.drawImage(item.canvas, Math.round(item.left || 0), Math.round(item.top || 0));
                }
            }
        }

        ctx.globalAlpha = 1.0;
        drawLayers(psd, true);

        const pngBuffer = mainCanvas.toBuffer('image/png');
        await sharp(pngBuffer).toFile(outputPath);
        console.log(`✅ Robust Clean Preview generated at ${outputPath}`);
    } catch (error) {
        console.error(`Clean Preview Generation Failed:`, error.message);
        throw error;
    }
}

export async function generatePreview(filePath, outputPath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const psd = readPsd(buffer);
        const mainCanvas = createCanvas(psd.width, psd.height);
        const ctx = mainCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, psd.width, psd.height);

        if (psd.canvas) {
            ctx.drawImage(psd.canvas, 0, 0);
        } else {
            function drawAll(item) {
                if (item.children) {
                    for (let i = item.children.length - 1; i >= 0; i--) drawAll(item.children[i]);
                } else if (item.canvas && item.visible !== false) {
                    ctx.globalAlpha = item.opacity ?? 1;
                    ctx.drawImage(item.canvas, item.left || 0, item.top || 0);
                }
            }
            drawAll(psd);
        }

        const pngBuffer = mainCanvas.toBuffer('image/png');
        await sharp(pngBuffer).toFile(outputPath);
    } catch (error) {
        console.error(`Preview Generation Failed:`, error.message);
        throw error;
    }
}
