"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

import { getTemplates } from "@/lib/templates";

const CATEGORY = "ceremony-decor";
const SUBCATEGORY = "welcome-banner";
const TEMPLATES = getTemplates(CATEGORY, SUBCATEGORY);

export default function WelcomeBannerPage() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Welcome Banners
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Choose a professional PSD template to customize your traditional wedding welcome banner.
          </p>
        </header>

        <section className="mb-20">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Design Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* PSD Upload Option */}
            <TemplateUploadCard
              category="ceremony-decor"
              subcategory="welcome-banner"
            />
            {TEMPLATES.map(template => (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                previewUrl={template.preview}
                category="ceremony-decor"
                subcategory="welcome-banner"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
