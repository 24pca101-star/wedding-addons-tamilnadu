"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";
import { getTemplates } from "@/lib/templates";

const CATEGORY = "guest-gift-keepsakes";
const SUBCATEGORY = "fridge-magnet";
const TEMPLATES = getTemplates(CATEGORY, SUBCATEGORY);

export default function FridgeMagnetPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Fridge Magnets
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto italic">
            "Stick your wedding memories to the heart of the home. Custom designed magnets for your special day."
          </p>
          <div className="mt-8 h-1 w-24 mx-auto bg-pink-100 rounded-full" />
        </header>

        {/* Templates Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Design Templates</h2>
            <span className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-widest">5 Premium Designs</span>
          </div>
          
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
                previewUrl={t.preview}
                category={CATEGORY}
                subcategory={SUBCATEGORY}
              />
            ))}
          </div>
        </section>

        {/* Technical Info */}
        <div className="mt-20 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-center max-w-3xl mx-auto">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Technical Specification</h3>
          <p className="text-xs text-gray-400 font-medium">
            Standard 4"x4" or 3"x3" magnet formats supported. 
            High-gloss finish templates with durable magnetic backing designs.
          </p>
        </div>
      </div>
    </div>
  );
}
