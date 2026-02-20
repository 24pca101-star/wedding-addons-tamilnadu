import * as fabric from "fabric";
import { jsPDF } from "jspdf";

/**
 * Exports the Fabric.js canvas as a PNG file.
 */
export const exportAsPNG = (canvas: fabric.Canvas, filename: string = "wedding-banner.png") => {
    if (!canvas) return;

    // Export with high multiplier for high resolution
    const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 3, // 3x scale for high resolution
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exports the Fabric.js canvas as a Print-Ready PDF file.
 * We use 300 DPI multiplier (approx 4.16x for standard 72 DPI canvas).
 */
export const exportAsPDF = (
    canvas: fabric.Canvas,
    width: number,
    height: number,
    filename: string = "wedding-banner.pdf"
) => {
    if (!canvas) return;

    // Create high-resolution image for the PDF (300 DPI target)
    // 300 DPI / 72 DPI (base) = 4.166 multiplier
    const multiplier = 4.166;

    const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: multiplier,
    });

    // Dimensions in mm (1 inch = 25.4 mm)
    // Canvas dimensions are usually in px. We assume width/height passed are physical-equivalent px.
    // If the user picked 1000x500mm, we should use that.

    // Convert px to mm (standard screen density is 96 DPI, so 1mm ~ 3.78px)
    // However, if the user picks a size template, we might already have those numbers.
    const widthMm = width / 3.78;
    const heightMm = height / 3.78;

    const pdf = new jsPDF({
        orientation: width > height ? "landscape" : "portrait",
        unit: "mm",
        format: [widthMm, heightMm],
        compress: true,
    });

    // Add image with target dimensions
    pdf.addImage(dataURL, "PNG", 0, 0, widthMm, heightMm, undefined, 'FAST');

    // Metatada for print readiness
    pdf.setProperties({
        title: filename,
        subject: 'Wedding Banner Design',
        creator: 'Wedding Add-ons Studio',
    });

    pdf.save(filename);
};
