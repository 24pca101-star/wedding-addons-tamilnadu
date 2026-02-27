"use client";
import TemplateCard from "@/components/TemplateCard";

export default function TraditionalUmbrellaParasol() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-pink-800 font-serif mb-4 uppercase tracking-tight">
            Traditional Umbrella / Parasol
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Custom traditional wedding umbrellas and parasols. Choose to begin customizing.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateCard
            id="blank"
            name="Start from Scratch"
            previewUrl="/assets/blank-canvas.png"
            category="traditional-utility-items"
            subcategory="traditional-umbrella-parasol"
          />
        </div>
      </div>
    </div>
  );
}
