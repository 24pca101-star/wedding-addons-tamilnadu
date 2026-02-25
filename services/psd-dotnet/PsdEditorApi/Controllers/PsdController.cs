using Microsoft.AspNetCore.Mvc;
using Aspose.PSD;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.FileFormats.Psd.Layers;
using Aspose.PSD.ImageOptions;

namespace PsdEditorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PsdController : ControllerBase
    {
        private readonly string _templateDir;

        public PsdController()
        {
            // Walk up from service dir to find the wedding-add-ons root
            var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
            while (dir != null && !System.IO.File.Exists(Path.Combine(dir.FullName, "package.json")))
            {
                dir = dir.Parent;
            }
            _templateDir = dir != null
                ? Path.Combine(dir.FullName, "public", "storage", "templates")
                : Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "public", "storage", "templates");
        }

        [HttpGet("metadata/{filename}")]
        public IActionResult GetMetadata(string filename)
        {
            try
            {
                string filePath = Path.Combine(_templateDir, filename);
                if (!System.IO.File.Exists(filePath)) return NotFound("PSD template not found");

                using (PsdImage image = (PsdImage)Image.Load(filePath))
                {
                    var layers = new List<object>();
                    foreach (var layer in image.Layers)
                    {
                        var layerInfo = new Dictionary<string, object?>
                        {
                            ["name"] = layer.Name,
                            ["type"] = layer is TextLayer ? "text" : "image",
                            ["top"] = layer.Top,
                            ["left"] = layer.Left,
                            ["height"] = layer.Height,
                            ["width"] = layer.Width,
                            ["opacity"] = layer.Opacity,
                            ["visible"] = layer.IsVisible
                        };

                        if (layer is TextLayer textLayer)
                        {
                            layerInfo["text"] = GetTextProperties(textLayer);
                        }

                        layers.Add(layerInfo);
                    }

                    return Ok(new
                    {
                        width = image.Width,
                        height = image.Height,
                        layers = layers
                    });
                }
            }
            catch (Exception ex)
            {
                string filePath2 = Path.Combine(_templateDir, filename);
                return StatusCode(500, new
                {
                    error = $"Metadata extraction failed: {ex.Message}",
                    resolvedPath = filePath2,
                    fileExists = System.IO.File.Exists(filePath2),
                    stackTrace = ex.StackTrace?.Substring(0, Math.Min(500, ex.StackTrace?.Length ?? 0))
                });
            }
        }

        [HttpGet("preview/{filename}")]
        public IActionResult GetPreview(string filename)
        {
            try
            {
                string filePath = Path.Combine(_templateDir, filename);
                if (!System.IO.File.Exists(filePath)) return NotFound("PSD template not found");

                using (PsdImage image = (PsdImage)Image.Load(filePath))
                {
                    var ms = new MemoryStream();
                    image.Save(ms, new PngOptions());
                    ms.Position = 0;
                    return File(ms.ToArray(), "image/png");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Preview generation failed: {ex.Message}");
            }
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            var exists = Directory.Exists(_templateDir);
            string[] files = exists ? Directory.GetFiles(_templateDir).Select(Path.GetFileName).ToArray()! : Array.Empty<string>();
            return Ok(new
            {
                status = "ok",
                service = "psd-dotnet-service",
                templateDir = _templateDir,
                templateDirExists = exists,
                cwd = Directory.GetCurrentDirectory(),
                files = files
            });
        }

        private object GetTextProperties(TextLayer layer)
        {
            try
            {
                string fontName = "Arial";
                double fontSize = 12.0;

                // Use TextData API for rich text info
                try
                {
                    var textData = layer.TextData;
                    if (textData?.Items != null && textData.Items.Length > 0)
                    {
                        var firstItem = textData.Items[0];
                        if (firstItem.Style != null)
                        {
                            fontName = firstItem.Style.FontName ?? "Arial";
                            fontSize = firstItem.Style.FontSize;
                        }
                    }
                }
                catch { /* TextData may not be available for all text layers */ }

                return new
                {
                    value = layer.Text ?? "",
                    font = fontName,
                    size = fontSize,
                    color = new int[] { 0, 0, 0, 255 }
                };
            }
            catch
            {
                return new
                {
                    value = layer.Text ?? "",
                    font = "Arial",
                    size = 12.0,
                    color = new int[] { 0, 0, 0, 255 }
                };
            }
        }
    }
}
