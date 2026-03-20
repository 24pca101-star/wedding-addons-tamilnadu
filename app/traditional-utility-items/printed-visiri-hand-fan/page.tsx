"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

import { getTemplates } from "@/lib/templates";
const CATEGORY = "traditional-utility-items";
const SUBCATEGORY = "printed-visiri-hand-fan";
const TEMPLATES = getTemplates(CATEGORY, SUBCATEGORY);

export default function PrintedVisiriHandFan() {
  const templates = getTemplates("traditional-utility-items", "printed-visiri-hand-fan");
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Printed Visiri Hand Fan
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Custom traditional wedding printed visiri hand fans. Choose a professional PSD template to begin.
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
            {TEMPLATES.map((t) => (
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
        </section>
      </div>
    </div>
  );
}
