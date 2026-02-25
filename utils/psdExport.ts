import * as fabric from "fabric";

interface LayerEdit {
    layerName: string;
    type: "text" | "image";
    newValue: string;
}

interface ExportRequest {
    filename: string;
    format: "pdf" | "png" | "psd";
    edits: LayerEdit[];
}

/**
 * Sends canvas edits to the .NET service for high-fidelity PSD recomposition and export.
 * @param canvas The Fabric.js canvas instance.
 * @param psdFilename The original PSD filename.
 * @param format The desired output format.
 */
export async function exportViaPsdService(
    canvas: fabric.Canvas,
    psdFilename: string,
    format: "pdf" | "png" | "psd" = "pdf"
) {
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
            // Future: handle image placements/swaps
        }
    });

    const request: ExportRequest = {
        filename: psdFilename,
        format,
        edits
    };

    try {
        const response = await fetch("http://localhost:5199/api/Export/export", { // Default .NET port
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) throw new Error("PSD Export failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `customized-${psdFilename.replace(".psd", "." + format)}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Advanced Export Error:", error);
        alert("Failed to export via PSD service. Using fallback browser rendering.");
        return false;
    }
    return true;
}
