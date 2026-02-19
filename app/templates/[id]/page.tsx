import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Template {
  id: number;
  name: string;
  description: string;
  image_path: string;
}

export default function TemplateDetailsPage() {
  const params = useParams();
  const router = useRouter();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!template) return <div>Template not found.</div>;

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-10">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <img
          src={template.image_path}
          alt={template.name}
          className="w-full max-w-md h-auto object-contain rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-maroon mb-2 text-center">{template.name}</h1>
        <p className="text-gray-600 mb-6 text-center">{template.description}</p>
        <button
          className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#f709a3] transition shadow-sm"
          onClick={() => router.push(`/templates/${id}/editor`)}
        >
          Start Customizing
        </button>
      </div>
    </div>
  );
}
