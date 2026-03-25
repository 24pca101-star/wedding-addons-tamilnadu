import fs from 'fs';
import path from 'path';
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
    // Calculate relative path from templates directory to support nested submodules
    const templatesDir = path.resolve(process.cwd(), '../../public/storage/templates');
    const relativePath = path.relative(templatesDir, filePath).replace(/\\/g, '/');
    const filename = relativePath.split('/').pop();
    const buffer = fs.readFileSync(filePath);

    try {
        console.log(`[PSD] Reading ${relativePath} with options skipLayerImageData=${options.skipLayerImageData}`);
        return readPsd(buffer, options);
    } catch (e) {
        console.error(`[PSD] Error reading ${relativePath}:`, e.message);
        const isCmykError = e.message.includes('CMYK') || e.message.includes('Color mode not supported');
        
        if (isCmykError) {
            console.log(`[PSD] ⚠️ CMYK/Unsupported Mode Detected: ${relativePath}. Attempting .NET conversion...`);
            try {
                const baseUrl = process.env.DOTNET_SERVICE_URL || 'http://localhost:5199';
                console.log(`[PSD] Calling .NET service: ${baseUrl}/api/Psd/convertToRgb?filename=${relativePath}`);
                
                const convResponse = await axios.post(`${baseUrl}/api/Psd/convertToRgb?filename=${encodeURIComponent(relativePath)}`);
                console.log(`[PSD] .NET Response: ${convResponse.status} ${convResponse.statusText}`);
                
                if (convResponse.status === 200) {
                    const rgbPsdPath = filePath.replace('.psd', '_rgb.psd');
                    console.log(`[PSD] Reading converted RGB PSD: ${rgbPsdPath}`);
                    const rgbBuffer = fs.readFileSync(rgbPsdPath);
                    const psd = readPsd(rgbBuffer, options);
                    console.log(`[PSD] ✅ Successfully loaded RGB version of ${filename}`);
                    return psd;
                } else {
                    console.error(`[PSD] .NET Conversion returned non-200 status: ${convResponse.status}`);
                    throw e;
                }
            } catch (convError) {
                console.error(`[PSD] ❌ Fallback Failed for ${filename}:`, convError.message);
                if (convError.response) {
                    console.error(`[PSD] .NET Error Response:`, convError.response.data);
                }
                throw e; // Rethrow original error
            }
        }
        throw e;
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

        const psd = await loadPsdWithFallback(filePath, { skipLayerImageData: false, skipThumbnail: false });

        const layers = [];
        const elements = [];
        let layerCounter = 0;



        let currentClippingBase = null;

        async function processLayers(item, parentVisible = true, parentOpacity = 1) {
            const name = item.name || 'Unnamed Layer';
            const isGroup = !!item.children;
            const effectiveVisible = parentVisible && (item.visible !== false);
            const effectiveOpacity = parentOpacity * (item.opacity ?? 1);

            if (isGroup) {
                console.log(`📂 Entering Group: ${name} [Visible: ${effectiveVisible}]`);
                // When entering a group, clipping usually doesn't cross the boundary from outside
                // but layers inside use the local base.
                const prevBase = currentClippingBase;
                currentClippingBase = null; 
                
                if (item.children) {
                    for (const child of item.children) {
                        await processLayers(child, effectiveVisible, effectiveOpacity);
                    }
                }

                currentClippingBase = prevBase;
                return;
            }

            const dims = getLayerDimensions(item);
            const layerIndex = layerCounter++;
            const isText = (item.text != null);
            let layerImageUrl = null;
            
            console.log(`  📄 Processing Layer: ${name} [Type: ${isText ? 'text' : 'image'}] index: ${layerIndex} clipping: ${item.clipping}`);

            // Update clipping base if NOT clipped. 
            // A clipping base can be any layer (image, shape) that has a canvas.
            if (!item.clipping) {
                currentClippingBase = item;
            }

            // Export image layers
            let canvasToExport = item.canvas;

            // --- 1. Apply Layer Mask ---
            if (canvasToExport && item.mask && item.mask.canvas) {
                console.log(`🎭 Correcting Mask Alpha & Applying for layer: ${name}`);
                const maskCanvas = item.mask.canvas;
                const maskCtx = maskCanvas.getContext('2d');
                const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
                
                for (let i = 0; i < maskData.data.length; i += 4) {
                    maskData.data[i + 3] = maskData.data[i];
                }
                maskCtx.putImageData(maskData, 0, 0);

                const maskedCanvas = createCanvas(canvasToExport.width, canvasToExport.height);
                const mCtx = maskedCanvas.getContext('2d');
                mCtx.drawImage(canvasToExport, 0, 0);

                const mLeft = (item.mask.left || 0) - (item.left || 0);
                const mTop = (item.mask.top || 0) - (item.top || 0);

                mCtx.globalCompositeOperation = 'destination-in';
                mCtx.drawImage(maskCanvas, mLeft, mTop);
                canvasToExport = maskedCanvas;
            }

            // --- 2. Apply Clipping Mask ---
            if (item.clipping && currentClippingBase && currentClippingBase.processedCanvas && canvasToExport) {
                const baseCanvas = currentClippingBase.processedCanvas;
                
                const fullMaskCanvas = createCanvas(canvasToExport.width, canvasToExport.height);
                const maskCtx = fullMaskCanvas.getContext('2d');
                
                const mLeft = (currentClippingBase.left || 0) - (item.left || 0);
                const mTop = (currentClippingBase.top || 0) - (item.top || 0);
                
                maskCtx.drawImage(baseCanvas, mLeft, mTop);

                const maskedCanvas = createCanvas(canvasToExport.width, canvasToExport.height);
                const mCtx = maskedCanvas.getContext('2d');
                mCtx.drawImage(canvasToExport, 0, 0);
                mCtx.globalCompositeOperation = 'destination-in';
                mCtx.drawImage(fullMaskCanvas, 0, 0);
                canvasToExport = maskedCanvas;
            }

            // Store the processed canvas for potential use as a clipping base
            if (!item.clipping) {
                currentClippingBase = {
                    ...item,
                    processedCanvas: canvasToExport
                };
            }

            if (canvasToExport && layerStorageDir) {
                const layerId = `${layerIndex}.png`;
                const layerPath = `${layerStorageDir}/${layerId}`;
                const pngBuffer = canvasToExport.toBuffer('image/png');
                await sharp(pngBuffer).toFile(layerPath);
                layerImageUrl = `/storage/layers/${filename}/${layerId}`;
            }

            if (isText || layerImageUrl) {
                const layer = {
                    name: name,
                    type: isText ? 'text' : 'image',
                    top: dims.y,
                    left: dims.x,
                    width: dims.width,
                    height: dims.height,
                    opacity: Math.round(effectiveOpacity * 255),
                    visible: effectiveVisible,
                    hidden: item.visible === false,
                    clipping: !!item.clipping,
                    index: layerIndex,
                    imageUrl: layerImageUrl,
                    isFlattened: false,
                    blendMode: (function(mode) {

                        const mapping = {
                            'norm': 'source-over',
                            'dark': 'darken',
                            'mul ': 'multiply',
                            'idiv': 'color-dodge',
                            'lite': 'lighten',
                            'scrn': 'screen',
                            'div ': 'color-burn',
                            'over': 'overlay',
                            'hLgt': 'hard-light',
                            'sLgt': 'soft-light',
                            'diff': 'difference',
                            'smud': 'exclusion',
                            'hue ': 'hue',
                            'sat ': 'saturation',
                            'colr': 'color',
                            'lum ': 'luminosity',
                            'lddg': 'lighter', // Linear Dodge (Add)
                            'lbrn': 'color-burn', // Linear Burn
                            'vLgt': 'vivid-light',
                            'lLgt': 'linear-light',
                            'pLgt': 'pin-light',
                            'hMix': 'hard-mix'
                        };
                        return mapping[mode] || (mode === 'pass through' ? 'source-over' : mode);
                    })(item.blendMode || 'norm'),

                    text: isText ? {

                        value: item.text.text,
                        font: item.text.style?.font?.name || 'Inter',
                        size: (() => {
                            const baseFontSize = item.text.style?.fontSize || 24;
                            const transform = item.text.transform;
                            let scaleFactor = 1;
                            if (transform && transform.length >= 4) {
                                scaleFactor = Math.sqrt(transform[0] * transform[0] + transform[1] * transform[1]);
                            }
                            return Math.round(baseFontSize * scaleFactor);
                        })(),
                        color: item.text.style?.fillColor 
                            ? [item.text.style.fillColor.r, item.text.style.fillColor.g, item.text.style.fillColor.b, 255]
                            : [0, 0, 0, 255],
                        alignment: item.text.paragraphStyle?.justification || 'left'
                    } : null

                };
                layers.push(layer);

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
                    opacity: Math.round(effectiveOpacity * 255),
                    visible: effectiveVisible,
                    isFlattened: false,
                    blendMode: layer.blendMode
                });
            }
        }

        if (psd.children) {
            // Process children in forward order (already bottom-to-top from ag-psd)
            for (const child of psd.children) {
                await processLayers(child, true, 1.0);
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
        console.error(`Metadata Extraction Failed:`, error.stack || error.message);
        throw error;
    }
}

/**
 * Generates a high-quality "Clean" preview.
 */
export async function generateCleanPreview(filePath, outputPath) {
    try {
        const psd = await loadPsdWithFallback(filePath, { skipLayerImageData: false, skipThumbnail: false });
        const mainCanvas = createCanvas(psd.width, psd.height);
        const ctx = mainCanvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, psd.width, psd.height);

        console.log(`🎨 Parser: Generating CLEAN background via Robust Layering (PSD: ${psd.width}x${psd.height})`);

        function drawLayers(item, parentVisible = true) {
            const isVisible = parentVisible && item.visible !== false;
            const dims = getLayerDimensions(item);

            if (item.children) {
                for (const child of item.children) {
                    drawLayers(child, isVisible);
                }
            } else if (!item.text && isVisible && item.canvas) {
                ctx.globalAlpha = item.opacity ?? 1;
                ctx.drawImage(item.canvas, Math.round(dims.x), Math.round(dims.y));
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
        const psd = await loadPsdWithFallback(filePath, { skipLayerImageData: false, skipThumbnail: false });
        const mainCanvas = createCanvas(psd.width, psd.height);
        const ctx = mainCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, psd.width, psd.height);

        // Prioritize the saved composite (psd.canvas) if available, as it's often more accurate
        // for complex effects/blend modes. Fallback to layer-by-layer otherwise.
        let drawnAnything = false;
        if (psd.canvas) {
            console.log(`🚀 Using saved composite (psd.canvas) for preview`);
            ctx.drawImage(psd.canvas, 0, 0);
            drawnAnything = true;
        } else {
            console.log(`🎨 Using layer-by-layer rendering for preview`);
            function drawAll(item, parentVisible = true) {
                const isVisible = parentVisible && item.visible !== false;
                if (item.children) {
                    for (const child of item.children) {
                        drawAll(child, isVisible);
                    }
                } else if (isVisible && item.canvas && !item.text) {
                    const dims = getLayerDimensions(item);
                    ctx.globalAlpha = item.opacity ?? 1;
                    ctx.drawImage(item.canvas, Math.round(dims.x), Math.round(dims.y));
                    drawnAnything = true;
                }
            }
            drawAll(psd, true);
        }

        // Final fallback: Use embedded PSD thumbnail if available and we still have a blank/small output
        if ((!drawnAnything || mainCanvas.width < 100) && psd.thumbnail) {
            console.log(`🖼️ Using PSD THUMBNAIL as last-resort fallback`);
            // Clear and draw thumbnail (resizing it to fill the canvas)
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
            ctx.drawImage(psd.thumbnail, 0, 0, mainCanvas.width, mainCanvas.height);
        }

        const pngBuffer = mainCanvas.toBuffer('image/png');
        await sharp(pngBuffer).toFile(outputPath);
    } catch (error) {
        console.error(`Preview Generation Failed:`, error.message);
        throw error;
    }
}
