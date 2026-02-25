using Microsoft.AspNetCore.Mvc;
using Aspose.PSD;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.FileFormats.Psd.Layers;
using Aspose.PSD.ImageOptions;

namespace PsdEditorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportController : ControllerBase
    {
        private readonly string _templateDir;

        public ExportController()
        {
            var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
            while (dir != null && !System.IO.File.Exists(Path.Combine(dir.FullName, "package.json")))
            {
                dir = dir.Parent;
            }
            _templateDir = dir != null
                ? Path.Combine(dir.FullName, "public", "storage", "templates")
                : Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "public", "storage", "templates");
        }

        [HttpPost("export")]
        public IActionResult Export([FromBody] ExportRequest request)
        {
            try
            {
                string filePath = Path.Combine(_templateDir, request.Filename);
                if (!System.IO.File.Exists(filePath)) return NotFound("PSD template not found");

                using (PsdImage image = (PsdImage)Image.Load(filePath))
                {
                    foreach (var edit in request.Edits)
                    {
                        var layer = FindLayerByName(image, edit.LayerName);
                        if (layer is TextLayer textLayer && edit.Type == "text")
                        {
                            // Aspose.PSD UpdateText with text content only
                            textLayer.UpdateText(edit.NewValue);
                        }
                    }

                    string outputFormat = request.Format?.ToLower() ?? "pdf";
                    var ms = new MemoryStream();

                    if (outputFormat == "pdf")
                    {
                        image.Save(ms, new PdfOptions());
                        return File(ms.ToArray(), "application/pdf", "export.pdf");
                    }
                    else
                    {
                        image.Save(ms, new PngOptions());
                        return File(ms.ToArray(), "image/png", "export.png");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Export failed: {ex.Message}");
            }
        }

        private Layer? FindLayerByName(PsdImage image, string name)
        {
            foreach (var layer in image.Layers)
            {
                if (layer.Name.Equals(name, StringComparison.OrdinalIgnoreCase)) return layer;
            }
            return null;
        }
    }

    public class ExportRequest
    {
        public string Filename { get; set; } = string.Empty;
        public string Format { get; set; } = "pdf";
        public List<LayerEdit> Edits { get; set; } = new();
    }

    public class LayerEdit
    {
        public string LayerName { get; set; } = string.Empty;
        public string Type { get; set; } = "text";
        public string NewValue { get; set; } = string.Empty;
    }
}
