import TemplateCard from "@/components/TemplateCard";

import { useEffect, useState } from "react";

interface Template {
  id: number;
  name: string;
  description: string;
  image_path: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch templates");
        return res.json();
      })
      .then((data) => setTemplates(data))
      .catch(() => setError("Unable to load templates."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="min-h-screen bg-rose-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-8">Wedding Design Templates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
