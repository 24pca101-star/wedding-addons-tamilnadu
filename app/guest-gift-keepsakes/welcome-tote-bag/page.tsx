"use client";
import TemplateCard from "@/components/TemplateCard";

export default function WelcomeToteBag() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-pink-800 font-serif mb-4 uppercase tracking-tight">
            Welcome / Tote Bag
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Custom traditional wedding welcome tote bags. Choose to begin customizing.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateCard
            id="blank"
            name="Start from Scratch"
            previewUrl="/assets/blank-canvas.png"
            category="guest-gift-keepsakes"
            subcategory="welcome-tote-bag"
          />
          <TemplateCard
            id="design-1.psd"
            name="Royal Invitation"
            previewUrl="/storage/previews/design-1.png"
            category="guest-gift-keepsakes"
            subcategory="welcome-tote-bag"
          />
          <TemplateCard
            id="design-2.psd"
            name="Floral Elegance"
            previewUrl="/storage/previews/design-2.png"
            category="guest-gift-keepsakes"
            subcategory="welcome-tote-bag"
          />
          <TemplateCard
            id="design-5.psd"
            name="Modern Simple"
            previewUrl="/storage/previews/design-5.png"
            category="guest-gift-keepsakes"
            subcategory="welcome-tote-bag"
          />
          <TemplateCard
            id="design-6.psd"
            name="Traditional Gold"
            previewUrl="/storage/previews/design-6.png"
            category="guest-gift-keepsakes"
            subcategory="welcome-tote-bag"
          />
        </div>
      </div>
    </div>
  );
}
