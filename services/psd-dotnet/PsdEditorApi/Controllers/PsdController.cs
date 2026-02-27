using Microsoft.AspNetCore.Mvc;
using PsdEditorApi.Services;

namespace PsdEditorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PsdController : ControllerBase
    {
        private readonly string _templateDir;
        private readonly IBannerEditorService _editorService;
        private readonly IAiSuggestionService _aiService;

        public PsdController(IBannerEditorService editorService, IAiSuggestionService aiService)
        {
            _editorService = editorService;
            _aiService = aiService;

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
                if (!filename.EndsWith(".psd", StringComparison.OrdinalIgnoreCase)) filename += ".psd";
                string filePath = Path.Combine(_templateDir, filename);
                if (!System.IO.File.Exists(filePath)) return NotFound($"PSD template not found: {filename}");

                var metadata = _editorService.GetMetadata(filePath);
                return Ok(metadata);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Metadata extraction failed: {ex.Message}", details = ex.ToString() });
            }
        }

        [HttpGet("preview/{filename}")]
        public IActionResult GetPreview(string filename)
        {
            try
            {
                if (!filename.EndsWith(".psd", StringComparison.OrdinalIgnoreCase)) filename += ".psd";
                string filePath = Path.Combine(_templateDir, filename);
                if (!System.IO.File.Exists(filePath)) return NotFound($"PSD template not found: {filename}");

                var bytes = _editorService.GetPreview(filePath);
                return File(bytes, "image/png");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Preview generation failed: {ex.Message}");
            }
        }

        [HttpGet("split/{filename}")]
        public IActionResult SplitLayers(string filename)
        {
            try
            {
                if (!filename.EndsWith(".psd", StringComparison.OrdinalIgnoreCase)) filename += ".psd";
                string filePath = Path.Combine(_templateDir, filename);
                if (!System.IO.File.Exists(filePath)) return NotFound($"PSD template not found: {filename}");

                // Output directory for layer images
                // The original code had a ternary operator to determine previewBaseDir.
                // The instruction is to adjust the relative path to use three ".." if the package.json search fails,
                // or to simplify the path resolution.
                // Based on the provided snippet, it seems the intent is to always use the relative path from current directory.
                string previewBaseDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "public", "storage", "previews");

                // Use a relative URL so the frontend (Next.js) loads images from its own public directory
                string baseUrl = "/storage/previews"; 

                var metadata = _editorService.SplitLayers(filePath, previewBaseDir, baseUrl);
                return Ok(metadata);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Layer splitting failed: {ex.Message}", details = ex.ToString() });
            }
        }

        [HttpGet("suggestions/{filename}")]
        public IActionResult GetSuggestions(string filename)
        {
            try
            {
                string filePath = Path.Combine(_templateDir, filename);
                if (!System.IO.File.Exists(filePath)) return NotFound("PSD template not found");

                var metadata = _editorService.GetMetadata(filePath);
                var suggestions = _aiService.GetSuggestions(metadata);
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"AI Analysis failed: {ex.Message}");
            }
        }

        [HttpGet("fonts")]
        public IActionResult GetFonts()
        {
            try
            {
                var fontsDir = Path.Combine(Directory.GetCurrentDirectory(), "Fonts");
                var fonts = new List<string>();

                if (Directory.Exists(fontsDir))
                {
                    fonts.AddRange(Directory.GetFiles(fontsDir, "*.*")
                        .Where(f => f.EndsWith(".ttf") || f.EndsWith(".otf"))
                        .Select(Path.GetFileNameWithoutExtension)!);
                }

                var systemFonts = new[] { "Arial", "Times New Roman", "Courier New", "Verdana", "Georgia" };
                fonts.AddRange(systemFonts);

                return Ok(fonts.Distinct().OrderBy(f => f));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to list fonts: {ex.Message}");
            }
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            var exists = Directory.Exists(_templateDir);
            return Ok(new
            {
                status = "ok",
                service = "psd-editor-api",
                templateDir = _templateDir,
                templateDirExists = Directory.Exists(_templateDir),
                files = Directory.Exists(_templateDir) ? Directory.GetFiles(_templateDir).Select(Path.GetFileName) : null
            });
        }
    }
}
