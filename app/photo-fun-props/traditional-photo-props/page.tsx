"use client";
import { getTemplates } from "@/lib/templates";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

export default function TraditionalPhotoProps() {
  const templates = getTemplates("photo-fun-props", "traditional-photo-props");

  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Traditional Photo Props
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Custom traditional wedding photo props. Choose to begin customizing.
          </p>
        </header>

        <section className="mb-20">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Design Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <TemplateUploadCard
              category="photo-fun-props"
              subcategory="traditional-photo-props"
            />
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                previewUrl={template.preview}
                category="photo-fun-props"
                subcategory="traditional-photo-props"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
