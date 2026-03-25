"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";
import { getTemplates } from "@/lib/templates";

const CATEGORY = "ceremony-decor";
const SUBCATEGORY = "kolam-entrance-board";

export default function KolamEntranceBoard() {
  const templates = getTemplates(CATEGORY, SUBCATEGORY);

  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Kolam Entrance Board
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Traditional Kolam entrance board designs. Choose a PSD to begin customizing.
          </p>
        </header>

        {/* Templates Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Design Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <TemplateUploadCard 
              category={CATEGORY}
              subcategory={SUBCATEGORY}
            />
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                id={t.id}
                name={t.name}
                previewUrl={t.preview}
                category={CATEGORY}
                subcategory={SUBCATEGORY}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
