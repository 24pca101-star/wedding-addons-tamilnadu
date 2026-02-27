namespace PsdEditorApi.Services
{
    public interface IAiSuggestionService
    {
        List<DesignSuggestion> GetSuggestions(PsdMetadata metadata);
    }

    public class AiSuggestionService : IAiSuggestionService
    {
        public List<DesignSuggestion> GetSuggestions(PsdMetadata metadata)
        {
            var suggestions = new List<DesignSuggestion>();

            // 1. Check for Centering
            var mainTextLayers = metadata.Layers.Where(l => l.Type == "text" && l.Visible).ToList();
            foreach (var layer in mainTextLayers)
            {
                var centerX = layer.Left + (layer.Width / 2);
                var docCenterX = metadata.Width / 2;

                if (Math.Abs(centerX - docCenterX) > 50 && Math.Abs(centerX - docCenterX) < 200)
                {
                    suggestions.Add(new DesignSuggestion
                    {
                        Category = "Alignment",
                        Message = $"Consider centering '{layer.Name}' for a more balanced look.",
                        Impact = "Medium"
                    });
                }
            }

            // 2. Check for Contrast (Simplified placeholder)
            if (mainTextLayers.Any(l => l.Text?.Color[0] > 200 && l.Text?.Color[1] > 200 && l.Text?.Color[2] > 200))
            {
                suggestions.Add(new DesignSuggestion
                {
                    Category = "Style",
                    Message = "White text might be hard to read on light backgrounds. Try a darker color or adding a shadow.",
                    Impact = "High"
                });
            }

            // 3. Spacing check
            if (mainTextLayers.Count >= 2)
            {
                // Placeholder for more complex overlap/spacing logic
            }

            if (suggestions.Count == 0)
            {
                suggestions.Add(new DesignSuggestion
                {
                    Category = "Overall",
                    Message = "Your design looks great! Ready for print.",
                    Impact = "Low"
                });
            }

            return suggestions;
        }
    }

    public class DesignSuggestion
    {
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Impact { get; set; } = "Low";
    }
}
