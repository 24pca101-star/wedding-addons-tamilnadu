using Microsoft.AspNetCore.Mvc;
using Aspose.PSD;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.ImageOptions;
using SkiaSharp;

namespace PsdEditorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MockupController : ControllerBase
    {
        private readonly string _templateDir;
        private readonly string _mockupDir;

        public MockupController()
        {
            var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
            while (dir != null && !System.IO.File.Exists(Path.Combine(dir.FullName, "package.json")))
            {
                dir = dir.Parent;
            }
            
            _templateDir = Path.Combine(dir!.FullName, "public", "storage", "templates");
            _mockupDir = Path.Combine(dir!.FullName, "public", "assets", "mockups");
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateMockup([FromBody] MockupRequest request)
        {
            try
            {
                string psdPath = Path.Combine(_templateDir, request.PsdFilename);
                if (!System.IO.File.Exists(psdPath)) return NotFound("PSD not found");

                // 1. Extract Design using Aspose.PSD
                byte[] designBuffer;
                using (PsdImage image = (PsdImage)Image.Load(psdPath))
                {
                    // Update text layers if provided
                    if (request.Edits != null)
                    {
                        foreach (var edit in request.Edits)
                        {
                            var layer = image.Layers.FirstOrDefault(l => l.Name.Equals(edit.LayerName, StringComparison.OrdinalIgnoreCase));
                            if (layer is Aspose.PSD.FileFormats.Psd.Layers.TextLayer textLayer)
                            {
                                textLayer.UpdateText(edit.NewValue);
                            }
                        }
                    }

                    using (var ms = new MemoryStream())
                    {
                        image.Save(ms, new PngOptions());
                        designBuffer = ms.ToArray();
                    }
                }

                // 2. Composite Mockup using SkiaSharp
                string productDir = Path.Combine(_mockupDir, request.ProductType);
                string basePath = Path.Combine(productDir, "base.png");
                string shadowPath = Path.Combine(productDir, "shadow.png");
                string maskPath = Path.Combine(productDir, "mask.png");

                if (!System.IO.File.Exists(basePath)) return NotFound("Product base image not found");

                using (var baseBitmap = SKBitmap.Decode(basePath))
                using (var designBitmap = SKBitmap.Decode(designBuffer))
                using (var surface = SKSurface.Create(new SKImageInfo(baseBitmap.Width, baseBitmap.Height)))
                using (var canvas = surface.Canvas)
                {
                    // 1. Draw Base
                    canvas.DrawBitmap(baseBitmap, 0, 0);

                    // 2. Prepare Design Layer with Masking
                    using (var designSurface = SKSurface.Create(new SKImageInfo(baseBitmap.Width, baseBitmap.Height)))
                    using (var designCanvas = designSurface.Canvas)
                    {
                        // Draw the design (scaled and centered)
                        float scale = Math.Min((float)baseBitmap.Width / designBitmap.Width, (float)baseBitmap.Height / designBitmap.Height) * 0.6f;
                        float dWidth = designBitmap.Width * scale;
                        float dHeight = designBitmap.Height * scale;
                        float dx = (baseBitmap.Width - dWidth) / 2;
                        float dy = (baseBitmap.Height - dHeight) / 2;
                        
                        designCanvas.DrawBitmap(designBitmap, new SKRect(dx, dy, dx + dWidth, dy + dHeight));

                        // Apply Mask if available
                        if (System.IO.File.Exists(maskPath))
                        {
                            using (var maskBitmap = SKBitmap.Decode(maskPath))
                            using (var maskPaint = new SKPaint { BlendMode = SKBlendMode.DstIn })
                            {
                                designCanvas.DrawBitmap(maskBitmap, new SKRect(0, 0, baseBitmap.Width, baseBitmap.Height), maskPaint);
                            }
                        }

                        // Draw masked design onto main canvas
                        canvas.DrawImage(designSurface.Snapshot(), 0, 0);
                    }

                    // 3. Apply Shadows
                    if (System.IO.File.Exists(shadowPath))
                    {
                        using (var shadowBitmap = SKBitmap.Decode(shadowPath))
                        using (var shadowPaint = new SKPaint { BlendMode = SKBlendMode.Multiply })
                        {
                            canvas.DrawBitmap(shadowBitmap, new SKRect(0, 0, baseBitmap.Width, baseBitmap.Height), shadowPaint);
                        }
                    }

                    using (var image = surface.Snapshot())
                    using (var data = image.Encode(SKEncodedImageFormat.Png, 100))
                    {
                        return File(data.ToArray(), "image/png");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GenerateMockup: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, $"Mockup generation failed: {ex.Message} | StackTrace: {ex.StackTrace}");
            }
        }
    }

    public class MockupRequest
    {
        public string PsdFilename { get; set; } = "";
        public string ProductType { get; set; } = "tote-bag";
        public List<LayerEdit>? Edits { get; set; }
    }
}
