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

export async function parsePsdMetadata(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        // Skip image data for speed, but keep text/metadata
        const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });

        const layers = [];
        const elements = [];

        // We use the PSD document dimensions as the canonical size
        const docWidth = psd.width;
        const docHeight = psd.height;

        function processLayers(item, parentPath = '', parentVisible = true) {
            const isVisible = parentVisible && item.visible !== false;

            if (item.children) {
                // PSD children are ordered TOP to BOTTOM in ag-psd.
                item.children.forEach(child => processLayers(child, parentPath + (item.name || 'Group') + '/', isVisible));
            } else {
                const dims = getLayerDimensions(item);
                const isText = item.text != null;

                const layer = {
                    name: item.name,
                    type: item.type === 'text' ? 'text' : 'image',
                    top: item.top,
                    left: item.left,
                    width: item.width,
                    height: item.height,
                    opacity: item.opacity,
                    visible: item.visible,
                    text: item.text ? {
                        value: item.text.text,
                        font: cleanFontName,
                        size: style.fontSize || 24,
                        color: style.fillColor ?
                            `rgb(${Math.round(style.fillColor.r)}, ${Math.round(style.fillColor.g)}, ${Math.round(style.fillColor.b)})` :
                            '#000000',
                        alignment: style.justification || 'left'
                    };
                }
                layers.push(layer);

                // Elements array for modern frontend
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
            psd.children.forEach(child => processLayers(child, '', true));
        }

        return {
            width: docWidth,
            height: docHeight,
            realWidth: docWidth, // Clip to document
            realHeight: docHeight,
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
 * This restores the "Yesterday" quality while removing ghosting.
 */
export async function generateCleanPreview(filePath, outputPath) {
    try {
        const buffer = fs.readFileSync(filePath);
        // We MUST NOT skip layer data
        const psd = readPsd(buffer);

        const mainCanvas = createCanvas(psd.width, psd.height);
        const ctx = mainCanvas.getContext('2d');

        // Start with a clean white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, psd.width, psd.height);

        console.log(`🎨 Parser: Generating CLEAN background via Robust Layering (PSD: ${psd.width}x${psd.height})`);

        function drawLayers(item, parentVisible = true) {
            const isVisible = parentVisible && item.visible !== false;

            if (item.children) {
                // ag-psd children are TOP to BOTTOM.
                // To draw correctly, we must iterate REVERSE (BOTTOM to TOP).
                for (let i = item.children.length - 1; i >= 0; i--) {
                    drawLayers(item.children[i], isVisible);
                }
            } else {
                const isText = (item.text != null);

                // Only draw non-text, visible, image-containing layers
                if (!isText && isVisible && item.canvas) {
                    ctx.globalAlpha = item.opacity ?? 1;
                    // Draw at global PSD coordinates
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

// Simple preview
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
            // Fallback to manual drawing if composite missing
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
