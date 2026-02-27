using Aspose.PSD;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.FileFormats.Psd.Layers;
using Aspose.PSD.ImageOptions;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace PsdEditorApi.Services
{
    public interface IBannerEditorService
    {
        PsdMetadata GetMetadata(string filePath);
        byte[] GetPreview(string filePath);
        byte[] Export(string filePath, ExportOptions options);
        PsdMetadata SplitLayers(string filePath, string outputBaseDir, string baseUrl);
    }

    public class BannerEditorService : IBannerEditorService
    {
        public PsdMetadata GetMetadata(string filePath)
        {
            using (PsdImage image = (PsdImage)Image.Load(filePath))
            {
                var layers = new List<LayerMetadata>();
                foreach (var layer in image.Layers)
                {
                    var layerInfo = new LayerMetadata
                    {
                        Name = layer.Name,
                        Type = layer is TextLayer ? "text" : "image",
                        Top = layer.Top,
                        Left = layer.Left,
                        Height = layer.Height,
                        Width = layer.Width,
                        Opacity = layer.Opacity,
                        Visible = layer.IsVisible
                    };

                    if (layer is TextLayer textLayer)
                    {
                        layerInfo.Text = GetTextProperties(textLayer);
                    }

                    layers.Add(layerInfo);
                }

                return new PsdMetadata
                {
                    Width = image.Width,
                    Height = image.Height,
                    Layers = layers
                };
            }
        }

        public byte[] GetPreview(string filePath)
        {
            using (PsdImage image = (PsdImage)Image.Load(filePath))
            {
                var ms = new MemoryStream();
                image.Save(ms, new PngOptions());
                return ms.ToArray();
            }
        }

        public PsdMetadata SplitLayers(string filePath, string outputBaseDir, string baseUrl)
        {
            string fileName = Path.GetFileNameWithoutExtension(filePath);
            string psdOutputDir = Path.Combine(outputBaseDir, fileName);
            
            if (!Directory.Exists(psdOutputDir))
            {
                Directory.CreateDirectory(psdOutputDir);
            }

            using (PsdImage image = (PsdImage)Image.Load(filePath))
            {
                var layers = new List<LayerMetadata>();
                
                // 1. Traverse layers to extract Text Metadata
                foreach (var layer in image.Layers)
                {
                    if (layer is TextLayer textLayer)
                    {
                        layers.Add(new LayerMetadata
                        {
                            Name = layer.Name,
                            Type = "text",
                            Top = layer.Top,
                            Left = layer.Left,
                            Height = layer.Height,
                            Width = layer.Width,
                            Opacity = layer.Opacity,
                            Visible = layer.IsVisible,
                            Text = GetTextProperties(textLayer)
                        });
                    }
                }

                // 2. Generate "Clean" Background Image
                string bgFileName = "background.png";
                string bgPath = Path.Combine(psdOutputDir, bgFileName);

                // Hide all text layers before saving the composite preview
                var textLayerStatuses = new Dictionary<Layer, bool>();
                foreach (var layer in image.Layers)
                {
                    if (layer is TextLayer)
                    {
                        textLayerStatuses[layer] = layer.IsVisible;
                        layer.IsVisible = false;
                    }
                }

                try 
                {
                    image.Save(bgPath, new PngOptions() 
                    { 
                        ColorType = Aspose.PSD.FileFormats.Png.PngColorType.TruecolorWithAlpha 
                    });
                }
                finally 
                {
                    // Restore original visibility statuses (not strictly needed but good practice)
                    foreach (var kvp in textLayerStatuses)
                    {
                        kvp.Key.IsVisible = kvp.Value;
                    }
                }

                return new PsdMetadata
                {
                    Width = image.Width,
                    Height = image.Height,
                    BackgroundUrl = $"{baseUrl}/{fileName}/{bgFileName}",
                    Layers = layers
                };
            }
        }

        public byte[] Export(string filePath, ExportOptions options)
        {
            using (PsdImage image = (PsdImage)Image.Load(filePath))
            {
                if (options.TargetWidth > 0 && options.TargetHeight > 0)
                {
                    image.Resize(options.TargetWidth, options.TargetHeight, ResizeType.HighQualityResample);
                }

                foreach (var edit in options.Edits)
                {
                    var layer = image.Layers.FirstOrDefault(l => l.Name.Equals(edit.LayerName, StringComparison.OrdinalIgnoreCase));
                    if (layer == null) continue;

                    if (edit.Left.HasValue) layer.Left = edit.Left.Value;
                    if (edit.Top.HasValue) layer.Top = edit.Top.Value;

                    if (layer is TextLayer textLayer && edit.Type == "text")
                    {
                        if (!string.IsNullOrEmpty(edit.NewValue))
                        {
                            textLayer.UpdateText(edit.NewValue);
                        }

                        if (edit.Color != null && edit.Color.Length >= 3)
                        {
                            var textData = textLayer.TextData;
                            if (textData != null && textData.Items.Length > 0)
                            {
                                var style = textData.Items[0].Style;
                                style.FillColor = Color.FromArgb(
                                    edit.Color.Length > 3 ? edit.Color[3] : 255,
                                    edit.Color[0], edit.Color[1], edit.Color[2]);
                                textData.UpdateLayerData();
                            }
                        }
                    }
                }

                var ms = new MemoryStream();
                if (options.Format?.ToLower() == "pdf")
                {
                    image.Save(ms, new PdfOptions());
                }
                else
                {
                    image.Save(ms, new PngOptions() { ColorType = Aspose.PSD.FileFormats.Png.PngColorType.TruecolorWithAlpha });
                }
                return ms.ToArray();
            }
        }

        private TextProperties GetTextProperties(TextLayer layer)
        {
            var props = new TextProperties
            {
                Value = layer.Text ?? "",
                Font = "Arial",
                Size = 12.0,
                Color = new[] { 0, 0, 0, 255 }
            };

            try
            {
                var textData = layer.TextData;
                if (textData?.Items != null && textData.Items.Length > 0)
                {
                    var style = textData.Items[0].Style;
                    if (style != null)
                    {
                        props.Font = style.FontName ?? "Arial";
                        props.Size = style.FontSize;
                        
                        if (style.FillColor is Color c)
                        {
                            props.Color = new[] { (int)c.R, (int)c.G, (int)c.B, (int)c.A };
                        }
                    }
                }
            }
            catch { }

            return props;
        }
    }

    public class PsdMetadata
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public string? BackgroundUrl { get; set; }
        public List<LayerMetadata> Layers { get; set; } = new();
    }

    public class LayerMetadata
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "image";
        public string? LayerUrl { get; set; }
        public int Top { get; set; }
        public int Left { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public int Opacity { get; set; }
        public bool Visible { get; set; }
        public TextProperties? Text { get; set; }
    }

    public class TextProperties
    {
        public string Value { get; set; } = string.Empty;
        public string Font { get; set; } = string.Empty;
        public double Size { get; set; }
        public int[] Color { get; set; } = new int[4];
    }

    public class ExportOptions
    {
        public int TargetWidth { get; set; }
        public int TargetHeight { get; set; }
        public string Format { get; set; } = "png";
        public List<LayerEditData> Edits { get; set; } = new();
    }

    public class LayerEditData
    {
        public string LayerName { get; set; } = string.Empty;
        public string Type { get; set; } = "text";
        public string NewValue { get; set; } = string.Empty;
        public int? Left { get; set; }
        public int? Top { get; set; }
        public float? FontSize { get; set; }
        public int[]? Color { get; set; }
    }
}
