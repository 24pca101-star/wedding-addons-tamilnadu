using Microsoft.AspNetCore.Mvc;
using PsdEditorApi.Services;

namespace PsdEditorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportController : ControllerBase
    {
        private readonly string _templateDir;
        private readonly IBannerEditorService _editorService;

        public ExportController(IBannerEditorService editorService)
        {
            _editorService = editorService;

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

                var options = new ExportOptions
                {
                    TargetWidth = request.TargetWidth,
                    TargetHeight = request.TargetHeight,
                    Format = request.Format,
                    Edits = request.Edits.Select(e => new LayerEditData
                    {
                        LayerName = e.LayerName,
                        Type = e.Type,
                        NewValue = e.NewValue,
                        Left = e.Left,
                        Top = e.Top,
                        FontSize = e.FontSize,
                        Color = e.Color
                    }).ToList()
                };

                var bytes = _editorService.Export(filePath, options);
                
                string contentType = request.Format?.ToLower() == "pdf" ? "application/pdf" : "image/png";
                string downloadName = $"export.{ (request.Format?.ToLower() == "pdf" ? "pdf" : "png") }";

                return File(bytes, contentType, downloadName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Export failed: {ex.Message}");
            }
        }
    }

    public class ExportRequest
    {
        public string Filename { get; set; } = string.Empty;
        public string Format { get; set; } = "pdf";
        public int TargetWidth { get; set; }
        public int TargetHeight { get; set; }
        public List<LayerEdit> Edits { get; set; } = new();
    }

    public class LayerEdit
    {
        public string LayerName { get; set; } = string.Empty;
        public string Type { get; set; } = "text";
        public string NewValue { get; set; } = string.Empty;
        public int? Left { get; set; }
        public int? Top { get; set; }
        public float? FontSize { get; set; }
        public string? FontFamily { get; set; }
        public int[]? Color { get; set; }
    }
}
