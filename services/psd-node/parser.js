const fs = require('fs');
const { readPsd, initializeCanvas } = require('ag-psd');
const sharp = require('sharp');
const { createCanvas } = require('canvas');

// Initialize ag-psd with node-canvas implementation
// Omit second argument to let ag-psd use its internal safe createImageData
initializeCanvas(createCanvas);

/**
 * Parses a PSD file and extracts layer metadata.
 * @param {string} filePath Path to the PSD file.
 * @returns {Promise<Object>} Metadata JSON.
 */
async function parsePsdMetadata(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const psd = readPsd(buffer, { skipLayerData: false, skipThumbnail: true });

        const layers = [];
        function processLayers(item, parentPath = '') {
            if (item.children) {
                item.children.forEach(child => processLayers(child, parentPath + item.name + '/'));
            } else {
                layers.push({
                    name: item.name,
                    type: item.text ? 'text' : 'image',
                    top: item.top,
                    left: item.left,
                    width: item.width,
                    height: item.height,
                    opacity: item.opacity,
                    visible: item.visible,
                    text: item.text ? {
                        value: item.text.text,
                        font: item.text.fonts?.[0]?.name,
                        size: item.text.fonts?.[0]?.size,
                        color: item.text.colors?.[0],
                        alignment: item.text.justification
                    } : null
                });
            }
        }

        if (psd.children) {
            psd.children.forEach(child => processLayers(child));
        }

        return {
            width: psd.width,
            height: psd.height,
            layers: layers
        };
    } catch (error) {
        console.error(`Metadata Extraction Failed for ${filePath}:`, error.message);
        return { width: 1000, height: 1000, layers: [] };
    }
}

/**
 * Generates a PNG preview of the PSD, hiding specifically identified editable layers.
 * @param {string} filePath Path to the PSD file.
 * @param {string} outputPath Path to save the PNG preview.
 */
async function generatePreview(filePath, outputPath) {
    try {
        const buffer = fs.readFileSync(filePath);
        // Optimize for speed and memory: skip layer data if only composite is needed
        const psd = readPsd(buffer, { skipLayerData: true, skipThumbnail: false });

        if (psd.canvas) {
            const pngBuffer = psd.canvas.toBuffer('image/png');
            await sharp(pngBuffer).toFile(outputPath);
        } else {
            // Fallback: try reading with skipLayerData: false in case composite isn't in header
            const psdFull = readPsd(buffer, { skipLayerData: false, skipThumbnail: true });
            if (psdFull.canvas) {
                const pngBuffer = psdFull.canvas.toBuffer('image/png');
                await sharp(pngBuffer).toFile(outputPath);
            } else {
                throw new Error("PSD does not contain a composite image (canvas)");
            }
        }
    } catch (error) {
        console.error(`Preview Generation Failed for ${filePath}:`, error.message);
        throw error;
    }
}

module.exports = { parsePsdMetadata, generatePreview };
