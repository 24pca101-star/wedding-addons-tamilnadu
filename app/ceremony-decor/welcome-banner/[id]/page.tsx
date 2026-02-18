"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import EditorLayout from "@/components/EditorLayout";
import PsdEditor from "@/components/PsdEditor";
import Image from "next/image";
interface TemplateDetails {
  id: number;
  name: string;
  description: string;
  psd_path: string;
  image_path: string;
}

export default function WelcomeBannerEditor() {
  const params = useParams();
  const id = params?.id;
  const [template, setTemplate] = useState<TemplateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!id) return;

  const loadTemplate = async () => {
    try {
      const res = await fetch(`/api/template-details/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTemplate(data);
    } catch {
      setError("Unable to load template details.");
    } finally {
      setLoading(false);
    }
  };

  loadTemplate();
}, [id]);


  const psdUrl = useMemo(() => template?.psd_path || "", [template]);
  const jpgUrl = useMemo(() => template?.image_path || "", [template]);
  const [showEditor, setShowEditor] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!template) return <div>Template not found.</div>;

  if (showEditor) {
    return (
      <EditorLayout>
        <PsdEditor psdUrl={psdUrl} jpgUrl={jpgUrl} />
      </EditorLayout>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-10">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <Image
          src={jpgUrl}
          alt={template.name}
          width={400}
          height={224}
          className="w-full max-w-md h-auto object-contain rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-maroon mb-2 text-center">{template.name}</h1>
        <p className="text-gray-600 mb-6 text-center">{template.description}</p>
        <button
          className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#f709a3] transition shadow-sm"
          onClick={() => setShowEditor(true)}
        >
          Start Customization
        </button>
      </div>
    </div>
  );
}
