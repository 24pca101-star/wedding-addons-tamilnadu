"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  image: string;
}

export default function DirectionalSignBoards() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/directional-sign-boards") // ✅ match folder name
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

  return (
    <div className="min-h-screen p-10 bg-pink-50">
      <h1 className="text-3xl font-bold mb-6">
        Directional Sign Boards
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template: Template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <Image
              src={template.image}
              alt={template.name}
              width={400} // Set a default width
              height={300} // Set a default height
              className="rounded-lg mb-4"
            />
            <h2 className="font-semibold">{template.name}</h2>
            <button
              className="mt-3 bg-pink-500 text-white px-4 py-2 rounded"
              onClick={() => router.push(`/ceremony-decor/directional-sign-boards/${template.id}`)}
            >
              Customize
            </button>
          </div>
        ))}
      </div>
    </div>
  );

}