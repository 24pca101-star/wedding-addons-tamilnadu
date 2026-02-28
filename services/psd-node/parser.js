import fs from 'fs';
import { readPsd, initializeCanvas } from 'ag-psd';
import sharp from 'sharp';
import { createCanvas } from 'canvas';
import axios from 'axios';

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
 * Helper to load a PSD with CMYK fallback
 */
async function loadPsdWithFallback(filePath, options = {}) {
    const filename = filePath.split(/[\\/]/).pop();
    const buffer = fs.readFileSync(filePath);

    try {
        return readPsd(buffer, options);
    } catch (e) {
        if (e.message.includes('Color mode not supported: CMYK')) {
            console.log(`⚠️ CMYK PSD Detected: ${filename}. Attempting .NET conversion to RGB...`);
            try {
                const baseUrl = process.env.DOTNET_SERVICE_URL || 'http://localhost:5199';
                const convResponse = await axios.post(`${baseUrl}/api/Psd/convertToRgb?filename=${filename}`);
                if (convResponse.status === 200) {
                    const rgbPsdPath = filePath.replace('.psd', '_rgb.psd');
                    const rgbBuffer = fs.readFileSync(rgbPsdPath);
                    const psd = readPsd(rgbBuffer, options);
                    console.log(`✅ Successfully loaded converted RGB PSD: ${filename}`);
                    return psd;
                } else {
                    throw new Error(`CMYK conversion service failed: ${convResponse.statusText}`);
                }
            } catch (convError) {
                console.error(`❌ CMYK Fallback Failed for ${filename}:`, convError.message);
                if (convError.response) {
                    console.error(`Response Data:`, convError.response.data);
                }
                throw e; // Rethrow original CMYK error if fallback fails
            }
        } else {
            throw e;
        }
    }
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

        const psd = await loadPsdWithFallback(filePath, { skipLayerImageData: false, skipThumbnail: true });

        const layers = [];
        const elements = [];
        let layerCounter = 0;

        /**
         * Recursively checks if a node or any of its children contains a text layer.
         */
        function hasTextLayers(node) {
            if (node.text != null) return true;
            if (node.children) {
                return node.children.some(child => hasTextLayers(child));
            }
            return false;
        }

        async function processLayers(item) {
            const name = item.name || 'Unnamed Layer';
            const isGroup = !!item.children;
            const containsText = hasTextLayers(item);

            const isTextLayer = (item.text != null);
            const textValue = item.text?.value || '';

            // Filter out Aspose watermarks
            if (name.includes('Aspose') || name.includes('Evaluation') ||
                textValue.includes('Aspose') || textValue.includes('Evaluation only')) {
                console.log(`🚫 Skipping Watermark Layer: ${name}`);
                return;
            }

            // Disable auto-flattening to allow access to all layers within folders as requested.
            // Only flatten if the layer is not a group.
            const shouldFlatten = false;

            if (isGroup && !shouldFlatten) {
                console.log(`📂 Entering Group (Open): ${name}`);
                // ag-psd children are ordered TOP to BOTTOM.
                for (const child of item.children) {
                    await processLayers(child);
                }
            } else {
                const layerIndex = layerCounter++;
                let layerImageUrl = null;
                const isText = (item.text != null);
                const dims = getLayerDimensions(item);

                console.log(`📄 Processing Layer: ${name} [Type: ${isText ? 'Text' : (shouldFlatten ? 'Flattened Group' : 'Image')}] [Visible: ${item.visible !== false}]`);

                // Export image/flattened group layers
                let canvasToExport = item.canvas;

                // If it's a flattened group, we MUST compose it (ag-psd group nodes rarely have a pre-rendered canvas)
                if (shouldFlatten) {
                    console.log(`🛠️ Composing Flattened Group: ${name}`);
                    const groupCanvas = createCanvas(psd.width, psd.height);
                    const gCtx = groupCanvas.getContext('2d');

                    function compose(node) {
                        if (node.children) {
                            // Bottom to Top for correct layering
                            for (let i = node.children.length - 1; i >= 0; i--) compose(node.children[i]);
                        } else if (node.canvas && node.visible !== false) {
                            gCtx.globalAlpha = node.opacity ?? 1;
                            gCtx.drawImage(node.canvas, Math.round(node.left || 0), Math.round(node.top || 0));
                        }
                    }
                    compose(item);

                    // Crop to bounding box (if it exists)
                    if (dims.width > 0 && dims.height > 0) {
                        const finalCanvas = createCanvas(dims.width, dims.height);
                        const fCtx = finalCanvas.getContext('2d');
                        fCtx.drawImage(groupCanvas, -dims.x, -dims.y);
                        canvasToExport = finalCanvas;
                    } else {
                        // Fallback to full PSD canvas if dimensions are weird
                        canvasToExport = groupCanvas;
                    }
                }

                if (canvasToExport && layerStorageDir) {
                    const layerId = `${layerIndex}.png`;
                    const layerPath = `${layerStorageDir}/${layerId}`;
                    const pngBuffer = canvasToExport.toBuffer('image/png');
                    await sharp(pngBuffer).toFile(layerPath);
                    layerImageUrl = `/storage/layers/${filename}/${layerId}`;
                }

                const layer = {
                    name: name,
                    type: isText ? 'text' : 'image',
                    top: dims.y,
                    left: dims.x,
                    width: dims.width,
                    height: dims.height,
                    opacity: item.opacity ?? 1,
                    visible: item.visible !== false,
                    imageUrl: layerImageUrl,
                    isFlattened: shouldFlatten,
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
                    visible: layer.visible,
                    isFlattened: shouldFlatten
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
        const psd = await loadPsdWithFallback(filePath);

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
