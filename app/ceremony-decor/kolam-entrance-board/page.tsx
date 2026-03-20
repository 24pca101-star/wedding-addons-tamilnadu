"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

import { getTemplates } from "@/lib/templates";

const CATEGORY = "ceremony-decor";
const SUBCATEGORY = "kolam-entrance-board";
const TEMPLATES = getTemplates(CATEGORY, SUBCATEGORY);

export default function KolamEntranceBoard() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-pink-800 font-serif mb-4 uppercase tracking-tight">
            Kolam Entrance Boards
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Traditional Kolam entrance board designs. Choose a PSD to begin customizing.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateUploadCard 
            category={CATEGORY}
            subcategory={SUBCATEGORY}
          />
          {TEMPLATES.map(t => (
            <TemplateCard
              key={t.id}
              id={t.id}
              name={t.name}
              previewUrl={`http://localhost:5005/preview/${t.preview}`}
              category={CATEGORY}
              subcategory={SUBCATEGORY}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
