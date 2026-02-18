import { Psd, Layer } from "ag-psd";
import * as fabric from "fabric";

/**
 * Converts a parsed PSD object into Fabric.js objects
 * @param psd The parsed PSD object from ag-psd
 * @param canvas The Fabric canvas instance
 */

export const loadPsdToCanvas = async (psd: Psd, canvas: fabric.Canvas) => {
    if (!psd || !psd.width || !psd.height) {
        console.error("Invalid PSD object:", { width: psd?.width, height: psd?.height });
        return { width: 1200, height: 800 };
    }

    console.log(`📄 PSD Info: ${psd.width}x${psd.height}, ${psd.children?.length || 0} layers`);

    // Try to clear canvas
    try {
        canvas.clear();
        console.log("✓ Canvas cleared");
    } catch (e) {
        console.warn("Could not clear canvas:", e);
    }

    let hasVisibleContent = false;

    // **STRATEGY 1: Try to render composite image**
    if (psd.canvas) {
        try {
            console.log(`📦 Found PSD composite canvas: ${psd.canvas.width}x${psd.canvas.height}`);
            
            // Convert canvas to image
            const imageData = psd.canvas.toDataURL?.('image/png');
            if (imageData) {
                const img = new Image();
                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        try {
                            const fabricImg = new fabric.Image(img, {
                                left: 0,
                                top: 0,
                                selectable: false,
                                evented: false,
                                name: "PSD Composite"
                            });
                            canvas.add(fabricImg);
                            canvas.renderAll();
                            hasVisibleContent = true;
                            console.log("✓ Composite image added to canvas");
                            resolve();
                        } catch (err) {
                            console.warn("Could not add composite to canvas:", err);
                            resolve();
                        }
                    };
                    img.onerror = () => {
                        console.warn("Could not load composite image");
                        resolve();
                    };
                    img.src = imageData;
                });
                
                if (hasVisibleContent) {
                    return { width: psd.width, height: psd.height };
                }
            }
        } catch (err) {
            console.warn("Composite rendering failed:", err);
        }
    }

    // **STRATEGY 2: Try rendering individual layers**
    if (psd.children && psd.children.length > 0) {
        console.log(`🎨 Processing ${psd.children.length} layers...`);
        let layerCount = 0;
        
        const processLayers = async (layers: Layer[]) => {
            for (const layer of layers) {
                if (layer.hidden) continue;
                
                try {
                    // Try to render layer as image
                    if (layer.canvas) {
                        const imageData = layer.canvas.toDataURL?.('image/png');
                        if (imageData) {
                            const img = new Image();
                            await new Promise<void>((resolve) => {
                                img.onload = () => {
                                    try {
                                        const left = layer.left || 0;
                                        const top = layer.top || 0;
                                        const fabricImg = new fabric.Image(img, {
                                            left, top, selectable: false, evented: false
                                        });
                                        canvas.add(fabricImg);
                                        layerCount++;
                                        hasVisibleContent = true;
                                        resolve();
                                    } catch { resolve(); }
                                };
                                img.onerror = () => resolve();
                                img.src = imageData;
                            });
                        }
                    }
                    // Try to add text layers
                    else if (layer.text?.text) {
                        const textObj = new fabric.IText(layer.text.text, {
                            left: layer.left || 0,
                            top: layer.top || 0,
                            fontSize: layer.text.style?.fontSize || 24,
                            fill: '#000000',
                            fontFamily: 'Arial'
                        });
                        canvas.add(textObj);
                        layerCount++;
                        hasVisibleContent = true;
                    }
                } catch (err) {
                    console.debug(`Skipped layer "${layer.name}"`);
                }
                
                // Recurse into groups
                if (layer.children?.length) {
                    await processLayers(layer.children);
                }
            }
        };
        
        await processLayers(psd.children);
        console.log(`✓ Processed ${layerCount} layers`);
    }

    // **STRATEGY 3: Show placeholder if nothing rendered**
    if (!hasVisibleContent) {
        console.warn("⚠️ No content found in PSD, adding placeholder");
        const placeholder = new fabric.Rect({
            left: 0, top: 0,
            width: psd.width, height: psd.height,
            fill: '#f0f0f0',
            stroke: '#999',
            strokeWidth: 2,
            selectable: false
        });
        canvas.add(placeholder);
        
        const text = new fabric.Text('PSD file loaded\n(visual content not available)', {
            left: psd.width / 2, top: psd.height / 2,
            fontSize: 20, textAlign: 'center',
            originX: 'center', originY: 'center'
        });
        canvas.add(text);
    }

    try {
        canvas.renderAll();
        console.log("✓ Canvas rendered");
    } catch (e) {
        console.warn("Render error:", e);
    }

    return { width: psd.width, height: psd.height };
};

interface LayerMetadata {
    editable?: 'text' | 'image' | 'color';
    role?: string;
    id?: string;
    locked?: boolean;
}

const parseMetadata = (name: string): { cleanName: string; metadata: LayerMetadata } => {
    const metaRegex = /\{([^}]+)\}/g;
    let metadata: LayerMetadata = {};
    let cleanName = name;

    let match;
    while ((match = metaRegex.exec(name)) !== null) {
        const content = match[1];
        if (content === 'locked') {
            metadata.locked = true;
        } else if (content.includes(':')) {
            const [key, value] = content.split(':').map(s => s.trim());
            if (key === 'editable') metadata.editable = value as any;
            else if (key === 'role') metadata.role = value;
            else if (key === 'id') metadata.id = value;
        }
    }

    cleanName = name.replace(metaRegex, '').trim();
    return { cleanName, metadata };
};

const hasFunctionalDescendants = (layer: Layer): boolean => {
    const { metadata } = parseMetadata(layer.name || "");
    if (metadata.editable || metadata.role || metadata.id || metadata.locked) return true;
    if (layer.children) {
        return layer.children.some(child => hasFunctionalDescendants(child));
    }
    return false;
};

const processLayer = async (layer: Layer, canvas: fabric.Canvas, psdWidth?: number, psdHeight?: number) => {
    try {
        if (layer.hidden) {
            console.log(`Skipping hidden layer: ${layer.name}`);
            return;
        }

        const { cleanName, metadata } = parseMetadata(layer.name || "");

        // Use absolute coordinates directly from PSD (Strict requirement)
        const left = layer.left || 0;
        const top = layer.top || 0;
        const opacity = layer.opacity !== undefined ? layer.opacity : 1;

        console.log(`Processing layer: "${cleanName}" type: ${layer.text ? 'text' : (layer.canvas ? 'canvas' : 'other')}`);

        // 1. Text Layer (Fully Editable by Default)
        if (layer.text) {
            try {
                const textData = layer.text;
                const fontSize = textData.style?.fontSize || 24;
                const fill = getPsdColor(textData.style?.fillColor);
                const tracking = (textData.style as any)?.tracking || 0;
                const charSpacing = tracking;

                const fontFamily = (textData.style as any)?.fontName
                    ? `"${(textData.style as any).fontName}", "Noto Sans Tamil", "Latha", sans-serif`
                    : '"Noto Sans Tamil", "Latha", sans-serif';

                const isLocked = metadata.locked === true;

                // Clip coordinates to workspace to prevent outlier scaling
                const clippedLeft = Math.max(-2000, Math.min(left, psdWidth || 10000));
                const clippedTop = Math.max(-2000, Math.min(top, psdHeight || 10000));

                const textObj = new fabric.IText(textData.text || "Text", {
                    left: clippedLeft,
                    top: clippedTop,
                    fontSize: fontSize,
                    fill: fill,
                    fontFamily: fontFamily,
                    charSpacing: charSpacing,
                    opacity: opacity,
                    selectable: !isLocked,
                    evented: true,
                    lockMovementX: isLocked,
                    lockMovementY: isLocked,
                    name: cleanName,
                    id: metadata.id,
                    role: metadata.role,
                } as any);

                canvas.add(textObj);
                console.log(`✓ Added text layer: "${cleanName}" at (${clippedLeft}, ${clippedTop})`);
            } catch (textErr) {
                console.warn(`Failed to render text layer "${layer.name}":`, textErr);
            }
        }
        // 2. Pixel/Image/Decoration Layer (Atomic Object Rendering)
        else if (layer.canvas || (layer as any).image) {
            try {
                const source = (layer.canvas || (layer as any).image) as HTMLCanvasElement;
                if (source && (source.width > 0 || source.height > 0)) {
                    console.log(`Rendering image layer: "${cleanName}" size: ${source.width}x${source.height} at pos: ${left},${top}`);

                    const isLocked = metadata.locked === true;
                    // Fabric v6: new Image(element, options) is preferred
                    const imgObj = new fabric.Image(source, {
                        left: left,
                        top: top,
                        opacity: opacity,
                        selectable: !isLocked,
                        evented: !isLocked, // Keep evented true if we want to select it, unless locked
                        lockMovementX: isLocked,
                        lockMovementY: isLocked,
                        name: cleanName,
                        id: metadata.id,
                        role: metadata.role,
                    } as any);

                    canvas.add(imgObj);
                    console.log(`✓ Added image layer: "${cleanName}"`);
                } else {
                    console.log(`Layer "${cleanName}" has 0-size canvas/image, checking for children...`);
                }
            } catch (imgErr) {
                console.warn(`Failed to render image layer "${layer.name}":`, imgErr);
            }
        }
        // 3. Group/Folder layer - check if group itself has canvas rendering
        else if (layer.children && layer.children.length > 0) {
            console.log(`Processing group container: "${cleanName}" with ${layer.children.length} children`);
            
            // Some PSDs render groups as composites - try to access group's composite canvas
            if ((layer as any).compositeCanvas) {
                try {
                    const source = (layer as any).compositeCanvas as HTMLCanvasElement;
                    if (source && source.width > 0 && source.height > 0) {
                        console.log(`✓ Rendering group composite: "${cleanName}" at (${left}, ${top})`);
                        const groupImg = new fabric.Image(source, {
                            left: left,
                            top: top,
                            opacity: opacity,
                            selectable: false,
                            evented: false,
                            name: cleanName,
                        } as any);
                        canvas.add(groupImg);
                    }
                } catch (e) {
                    console.log(`Group composite not available for "${cleanName}", processing children`);
                }
            }
        }
        // 4. Artboard or background layer with no visual property
        else if ((layer as any).type === 'artboard' || (layer as any).type === 'sheet') {
            console.log(`⚠ Artboard/Sheet: "${cleanName}" (may need different approach for rendering)`);
        }
        else {
            console.log(`⚠ Skip/Unrecognized: "${cleanName}" (text: ${!!layer.text}, canvas: ${!!layer.canvas}, image: ${!!(layer as any).image}, children: ${layer.children?.length || 0})`);
        }

        // 3. Always Recurse into groups for true object-based access
        if (layer.children && layer.children.length > 0) {
            // Processing children of groups
            const groupLayers = [...layer.children].reverse();
            for (const child of groupLayers) {
                await processLayer(child, canvas, psdWidth, psdHeight);
            }
        }
    } catch (error) {
        console.warn(`Error processing layer "${layer.name}":`, error);
    }
};

const getPsdColor = (color: any): string => {
    // Always ensure a visible color
    if (!color) {
        console.log("No color found, defaulting to black");
        return "#000000";
    }

    // Handle RGB (0-255)
    if ('r' in color && 'g' in color && 'b' in color) {
        const result = `rgb(${color.r || 0}, ${color.g || 0}, ${color.b || 0})`;
        console.log("RGB color:", result);
        return result;
    }

    // Handle FRGB (0-1)
    if ('fr' in color && 'fg' in color && 'fb' in color) {
        const r = Math.round((color.fr || 0) * 255);
        const g = Math.round((color.fg || 0) * 255);
        const b = Math.round((color.fb || 0) * 255);
        const result = `rgb(${r}, ${g}, ${b})`;
        console.log("FRGB color:", result);
        return result;
    }

    console.log("Unknown color format:", color);
    return "#000000";
};
