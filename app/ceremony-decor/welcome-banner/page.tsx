"use client";
import TemplateCard from "@/components/TemplateCard";

const TEMPLATES = [
  { id: 'design-1.psd', name: 'Winter Watercolor', preview: '/storage/previews/design-1.png' },
  { id: 'design-2.psd', name: 'Modern Pink Floral', preview: '/storage/previews/design-2.png' },
  { id: 'design-3.psd', name: 'Classic Floral Invite', preview: '/storage/previews/design-3.png' },
  { id: 'design-4.psd', name: 'Vintage Wedding Planner', preview: '/storage/previews/design-4.png' },
  { id: 'design-5.psd', name: 'Elegant Resort Banner', preview: '/storage/previews/design-5.png' },
  { id: 'design-6.psd', name: 'Autumn Watercolor', preview: '/storage/previews/design-6.png' },
  { id: 'design-9.psd', name: 'Royal Wedding Bloom', preview: '/storage/previews/design-9.png' },
  { id: 'design-10.psd', name: 'Royal Garden Bloom', preview: '/storage/previews/design-10.png' },
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
