// Example: Save fabric.js canvas edits as JSON
// Call this function when user clicks 'Save'
export async function saveDesign(
  fabricCanvas: { toJSON: () => unknown; toDataURL: (opts: { format: string; quality: number }) => string },
  userId: string | number,
  templateId: string | number
) {
  try {
    const designData = fabricCanvas.toJSON();
    // Export preview image (PNG data URL)
    const previewImage = fabricCanvas.toDataURL({ format: "png", quality: 0.9 });
    const res = await fetch("/api/save-design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        template_id: templateId,
        design_data: designData,
        preview_image: previewImage,
      }),
    });
    if (!res.ok) throw new Error("Failed to save design");
    const data = await res.json();
    // Handle success (show message, etc.)
    return data;
  } catch (err) {
    // Handle error (show error message, etc.)
    console.error("Save design error:", err);
    throw err;
  }
}
