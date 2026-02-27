"use client";
import TemplateCard from "@/components/TemplateCard";

// Mock data for this specific subcategory
const TEMPLATES = [
  { id: 'design-1.psd', name: 'Rose Gold Floral', preview: 'http://localhost:5001/preview/design-1.psd' },
  { id: 'design-2.psd', name: 'Winter Watercolor', preview: 'http://localhost:5001/preview/design-2.psd' },
  { id: 'design-3.psd', name: 'Winter Photo Invite', preview: 'http://localhost:5001/preview/design-3.psd' },
  { id: 'design-4.psd', name: 'Romantic Hearts', preview: 'http://localhost:5001/preview/design-4.psd' },
  { id: 'design-5.psd', name: 'Premium Gold Photo', preview: 'http://localhost:5001/preview/design-5.psd' },
  { id: 'design-6.psd', name: 'Artistic Yellow', preview: 'http://localhost:5001/preview/design-6.psd' },
];

export default function WelcomeBannerPage() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-pink-800 font-serif mb-4">
            Welcome Banners
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Choose a professional PSD template to customize your traditional wedding welcome banner.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Blank Canvas Option */}
          <TemplateCard
            id="blank"
            name="Start from Scratch"
            previewUrl="/assets/blank-canvas.png"
            category="ceremony-decor"
            subcategory="welcome-banner"
          />
          {TEMPLATES.map(t => (
            <TemplateCard
              key={t.id}
              id={t.id}
              name={t.name}
              previewUrl={t.preview.replace('.psd', '.png')}
              category="ceremony-decor"
              subcategory="welcome-banner"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
