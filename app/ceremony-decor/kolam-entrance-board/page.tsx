"use client";
import TemplateCard from "@/components/TemplateCard";

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
          <TemplateCard
            id="blank"
            name="Start from Scratch"
            previewUrl="/assets/blank-canvas.png"
            category="ceremony-decor"
            subcategory="kolam-entrance-board"
          />
          {/* Template placeholders */}
          <TemplateCard
            id="kolam-1.psd"
            name="Traditional Lotus Kolam"
            previewUrl="http://localhost:5001/preview/kolam-1.png"
            category="ceremony-decor"
            subcategory="kolam-entrance-board"
          />
        </div>
      </div>
    </div>
  );
}
