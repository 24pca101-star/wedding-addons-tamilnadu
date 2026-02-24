"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorLayout from "@/components/EditorLayout";
import PsdEditor from "@/components/PsdEditor";

interface Template {
  id: number;
  name: string;
  description: string;
  image_path: string;
  psd_path: string;
}

export default function TemplateEditorPage() {
  const params = useParams();
  const id = params?.id;
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/templates/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch template details");
        return res.json();
      })
      .then((data) => setTemplate(data))
      .catch(() => setError("Unable to load template details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading editor...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!template) return <div>Template not found.</div>;

  return (
    <EditorLayout>
      <PsdEditor psdUrl={template.psd_path} jpgUrl={template.image_path} />
    </EditorLayout>
  );
}
