"use client";
import TemplateCard from "@/components/TemplateCard";

export default function DirectionalSignBoards() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Directional Sign Boards
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Guide your guests with style using our traditional directional sign PSD templates.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateCard
            id="blank"
            name="Start from Scratch"
            previewUrl="/assets/blank-canvas.png"
            category="ceremony-decor"
            subcategory="directional-sign-boards"
          />
          {/* Template placeholders */}
          <TemplateCard
            id="directional-1.psd"
            name="Wedding Arrow Floral"
            previewUrl="http://localhost:5001/preview/directional-1.png"
            category="ceremony-decor"
            subcategory="directional-sign-boards"
          />
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </div>
  );
}

