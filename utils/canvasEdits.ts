import * as fabric from "fabric";

export interface LayerEdit {
    layerName: string;
    type: "text" | "image";
    newValue: string;
    left?: number;
    top?: number;
    fontSize?: number;
    color?: number[];
}

/**
 * Extracts edits from the canvas and prepares them for the .NET PSD service.
 * Projects coordinates from scaled canvas back to original PSD space.
 */
export function getCanvasEdits(canvas: fabric.Canvas, originalWidth?: number): LayerEdit[] {
    const objects = canvas.getObjects();
    const edits: LayerEdit[] = [];

    // Calculate the scale factor used to fit the PSD on the canvas
    const targetScale = (originalWidth && originalWidth > 0)
        ? canvas.width / originalWidth
        : 1;

    objects.forEach((obj: any) => {
        // Only include objects that mapped from a PSD layer
        if (obj.psdLayerName) {
            const edit: LayerEdit = {
                layerName: obj.psdLayerName,
                type: obj.type === "textbox" ? "text" : "image",
                newValue: obj.text || "",
                // Project back to original PSD coordinates
                left: Math.round(obj.left / targetScale),
                top: Math.round(obj.top / targetScale)
            };

            if (obj.type === "textbox") {
                edit.fontSize = Math.round(obj.fontSize / targetScale);

                // Extract RGBA from Fabric color string
                if (typeof obj.fill === 'string' && obj.fill.startsWith('rgba')) {
                    const match = obj.fill.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                    if (match) {
                        edit.color = [
                            parseInt(match[1]),
                            parseInt(match[2]),
                            parseInt(match[3]),
                            match[4] ? Math.round(parseFloat(match[4]) * 255) : 255
                        ];
                    }
                } else if (typeof obj.fill === 'string' && obj.fill.startsWith('#')) {
                    // Simple hex to RGB
                    const r = parseInt(obj.fill.slice(1, 3), 16);
                    const g = parseInt(obj.fill.slice(3, 5), 16);
                    const b = parseInt(obj.fill.slice(5, 7), 16);
                    edit.color = [r, g, b, 255];
                }
            }

            edits.push(edit);
        }
    });

    return edits;
}
