using Aspose.PSD;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.FileFormats.Psd.Layers;
using Aspose.PSD.ImageOptions;
using Aspose.PSD.ImageLoadOptions;
using System.IO;
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
                Console.WriteLine($"[DEBUG] SplitLayers: Processing {image.Layers.Length} layers from {fileName}");
                var layers = new List<LayerMetadata>();
                
                // Traverse layers from bottom to top (Aspose layers are top to bottom, so iterate 0 to Length-1 to add bottom layers first in Fabric)
                for (int i = 0; i < image.Layers.Length; i++)
                {
                    var layer = image.Layers[i];
                    
                    // Visibility Check: Skip if the layer itself is hidden
                    if (!layer.IsVisible) continue;
                    
                    // Skip hidden or empty layers
                    if (layer.Width <= 0 || layer.Height <= 0) continue;

                    // Skip known Aspose evaluation watermark layers or placeholder layers if they clobber the design
                    if (layer.Name != null && (layer.Name.Contains("Evaluation") || layer.Name.Contains("Aspose"))) continue;

                    // Skip LayerGroup itself because we want the individual layers inside. 
                    // Aspose's image.Layers is already flat and includes all sub-layers.
                    if (layer is LayerGroup) continue;

                    var layerInfo = new LayerMetadata
                    {
                        Name = layer.Name ?? $"Layer_{i}",
                        Type = layer is TextLayer ? "text" : "image",
                        Top = layer.Top,
                        Left = layer.Left,
                        Height = layer.Height,
                        Width = layer.Width,
                        Opacity = layer.Opacity,
                        Visible = true // We already filtered out-of-view ones
                    };

                    if (layer is TextLayer textLayer)
                    {
                        layerInfo.Text = GetTextProperties(textLayer);
                    }
                    else if (layerInfo.Visible && layer.Width > 0 && layer.Height > 0)
                    {
                        // Export this specific layer as a separate PNG
                        string layerFileName = $"layer_{i}.png";
                        string layerFilePath = Path.Combine(psdOutputDir, layerFileName);
                        
                        try 
                        {
                            layerInfo.LayerUrl = $"{baseUrl}/{fileName}/{layerFileName}";

                            // CACHING: Only render and save if it doesn't already exist
                            if (!File.Exists(layerFilePath))
                            {
                                // The "Graphics Compositor": explicitly paint each layer onto a tight transparent canvas.
                                // This ensures complex Photoshop effects and fill layers render perfectly.
                                using (var tightImg = new PsdImage(layer.Width, layer.Height))
                                {
                                    var graphics = new Aspose.PSD.Graphics(tightImg);
                                    graphics.Clear(Color.Transparent);
                                    
                                    // Draw the layer from its internal 0,0 origin to the canvas
                                    graphics.DrawImage(layer, new Rectangle(0, 0, layer.Width, layer.Height), new Rectangle(0, 0, layer.Width, layer.Height), GraphicsUnit.Pixel);

                                    tightImg.Save(layerFilePath, new PngOptions() 
                                    { 
                                        ColorType = Aspose.PSD.FileFormats.Png.PngColorType.TruecolorWithAlpha 
                                    });
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[ERROR] Failed to export layer {i} ({layer.Name}): {ex.Message}");
                            layerInfo.Visible = false; 
                        }
                    }

                    layers.Add(layerInfo);
                }

                Console.WriteLine($"[DEBUG] SplitLayers: Returning {layers.Count} layers metadata.");

                return new PsdMetadata
                {
                    Width = image.Width,
                    Height = image.Height,
                    BackgroundUrl = null, // No longer using a single background
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
