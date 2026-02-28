import * as fabric from "fabric";

export interface LayerEdit {
    layerName: string;
    type: "text" | "image";
    newValue: string;
}

export function getCanvasEdits(canvas: fabric.Canvas): LayerEdit[] {
    const objects = canvas.getObjects();
    const edits: LayerEdit[] = [];

    objects.forEach((obj: any) => {
        // Only include objects that mapped from a PSD layer
        if (obj.psdLayerName) {
            if (obj.type === "textbox") {
                edits.push({
                    layerName: obj.psdLayerName,
                    type: "text",
                    newValue: obj.text
                });
            }
        }
    });

    return edits;
}
