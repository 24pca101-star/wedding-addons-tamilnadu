"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

import { getTemplates } from "@/lib/templates";



const CATEGORY = "ceremony-decor";
const SUBCATEGORY = "directional-sign-boards";
const TEMPLATES = getTemplates(CATEGORY, SUBCATEGORY);


export default function DirectionalSignBoards() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Directional Sign Boards
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto italic">
            "Guide your guests with elegance. Custom realistic wedding sign boards for every venue style."
          </p>
          <div className="mt-8 h-1 w-24 mx-auto bg-pink-100 rounded-full" />
        </header>

        {/* Templates Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Design Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <TemplateUploadCard
              category="ceremony-decor"
              subcategory="directional-sign-boards"
            />
            {TEMPLATES.map(t => (
              <TemplateCard
                key={t.id}
                id={t.id}
                name={t.name}
                previewUrl={t.preview}
                category="ceremony-decor"
                subcategory="directional-sign-boards"
              />
            ))}
          </div>

        </section>
      </div>
    </div>
  );
}
