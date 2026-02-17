"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function TemplatePreview() {
  const { id } = useParams();
  const router = useRouter();
  interface Template {
    id: string;
    name: string;
    image: string;
    psd_path: string;
    preview: string;
    description: string;
  }
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetch("/api/directional-sign-boards")
      .then(res => res.json())
      .then((data: Template[]) => {
        const selected = data.find((t) => String(t.id) === String(id));
        setTemplate(selected || null);
      });
  }, [id]);

  if (!template) return <p className="p-10">Loading preview...</p>;

  return (
    <div className="min-h-screen p-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-maroon">
        {template.name} Preview
      </h1>

      {/* Preview Image */}
      <div className="mt-6 flex justify-center">
        <Image
          src={template.preview}
          alt={template.name}
          width={400}
          height={300}
          className="rounded shadow-lg max-w-lg"
        />
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600 flex justify-center">
        {template.description}
      </p>

      {/* Customize Button */}
<div className="flex justify-center mt-6">
  <button
    onClick={() => router.push(`/editor?psd=${encodeURIComponent(template.psd_path)}`)}
    className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow"
  >
    Start Customizing 🎨
  </button>
</div>

    </div>
  );
}
