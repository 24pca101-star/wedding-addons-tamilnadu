"use client";
import TemplateCard from "@/components/TemplateCard";

export default function TempleThemeStageBackDrop() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Temple Theme Stage Backdrop
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Select a traditional temple-themed backdrop PSD template to customize for your stage.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateCard
            id="blank"
            name="Start from Scratch"
            previewUrl="/assets/blank-canvas.png"
            category="ceremony-decor"
            subcategory="temple-theme-stage-backdrop"
          />
          {/* Template placeholders - system is ready for .psd files here */}
          <TemplateCard
            id="temple-1.psd"
            name="Gopuram Gold"
            previewUrl="http://localhost:5001/preview/temple-1.png"
            category="ceremony-decor"
            subcategory="temple-theme-stage-backdrop"
          />
        </div>
      </div>
    </div>
  );
}
