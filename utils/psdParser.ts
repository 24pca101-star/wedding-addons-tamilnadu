import { Psd, Layer } from "ag-psd";
import * as fabric from "fabric";

/**
 * Converts a parsed PSD object into Fabric.js objects
 * @param psd The parsed PSD object from ag-psd
 * @param canvas The Fabric canvas instance
 */

export const loadPsdToCanvas = async (psd: Psd, canvas: fabric.Canvas) => {
    if (!psd.children) return { width: 0, height: 0 };

    // Clear and set dimensions only if context is valid (prevents TypeError)
    // @ts-expect-error: contextContainer is not in types but exists in fabric.js
    if ((canvas as any).contextContainer) {
        canvas.clear();
        canvas.setDimensions({ width: psd.width, height: psd.height });
        canvas.backgroundColor = "white"; // Revert to white background, render components on top
    }

    // Render ALL layers to maintain 100% fidelity (Canva style)
    const layers = [...psd.children].reverse();
    for (const layer of layers) {
        await processLayer(layer, canvas); // Pass false to render EVERY layer
    }

    canvas.renderAll();
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

const processLayer = async (layer: Layer, canvas: fabric.Canvas) => {
    if (layer.hidden) return;

    const { cleanName, metadata } = parseMetadata(layer.name || "");

    // Use absolute coordinates directly from PSD (Strict requirement)
    const left = layer.left || 0;
    const top = layer.top || 0;
    const opacity = layer.opacity !== undefined ? layer.opacity : 1;

    // 1. Text Layer (Fully Editable by Default)
    if (layer.text) {
        const textData = layer.text;
        const fontSize = textData.style?.fontSize || 24;
        const fill = getPsdColor(textData.style?.fillColor);
        const tracking = (textData.style as any)?.tracking || 0;
        const charSpacing = tracking;

        const fontFamily = (textData.style as any)?.fontName
            ? `"${(textData.style as any).fontName}", "Noto Sans Tamil", "Latha", sans-serif`
            : '"Noto Sans Tamil", "Latha", sans-serif';

        const isLocked = metadata.locked === true;

        const textObj = new fabric.IText(textData.text || "Text", {
            left: left,
            top: top,
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
    }
    // 2. Pixel/Image/Decoration Layer (Atomic Object Rendering)
    else if (layer.canvas || (layer as any).image) {
        const source = (layer.canvas || (layer as any).image) as HTMLCanvasElement;
        if (source && source.width > 0 && source.height > 0) {
            try {
                const isLocked = metadata.locked === true;
                const imgObj = new fabric.Image(source, {
                    left: left,
                    top: top,
                    opacity: opacity,
                    selectable: !isLocked,
                    evented: !isLocked,
                    lockMovementX: isLocked,
                    lockMovementY: isLocked,
                    name: cleanName,
                    id: metadata.id,
                    role: metadata.role,
                } as any);

                canvas.add(imgObj);
            } catch (err) {
                console.error(`Error rendering layer ${layer.name}:`, err);
            }
        }
    }

    // 3. Always Recurse into groups for true object-based access
    if (layer.children && layer.children.length > 0) {
        const groupLayers = [...layer.children].reverse();
        for (const child of groupLayers) {
            await processLayer(child, canvas);
        }
    }
};

const getPsdColor = (color: any): string => {
    if (!color) return "#000000";

    // Handle RGB (0-255)
    if ('r' in color) {
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    // Handle FRGB (0-1)
    if ('fr' in color) {
        return `rgb(${Math.round(color.fr * 255)}, ${Math.round(color.fg * 255)}, ${Math.round(color.fb * 255)})`;
    }

    return "#000000";
};
