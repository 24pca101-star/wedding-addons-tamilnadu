"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

const TEMPLATES = [
  { id: 'hand-fan-1.psd', name: 'Traditional Floral', preview: 'http://localhost:5005/preview/hand-fan-1.png' },
  { id: 'hand-fan-2.psd', name: 'Royal Gold Border', preview: 'http://localhost:5005/preview/hand-fan-2.png' },
  { id: 'hand-fan-3.psd', name: 'Peacock Theme', preview: 'http://localhost:5005/preview/hand-fan-3.png' },
  { id: 'hand-fan-4.psd', name: 'Vintage Wedding', preview: 'http://localhost:5005/preview/hand-fan-4.png' },
  { id: 'hand-fan-5.psd', name: 'Modern Rose Bloom', preview: 'http://localhost:5005/preview/hand-fan-5.png' },
  { id: 'hand-fan-6.psd', name: 'Classic Script', preview: 'http://localhost:5005/preview/hand-fan-6.png' },
  { id: 'handfan1-gtfygh.psd', name: 'Custom Hand Fan 1', preview: 'http://localhost:5005/preview/handfan1-gtfygh.png' },
];

export default function PrintedVisiriHandFan() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-pink-800 font-serif mb-4 uppercase tracking-tight">
            Printed Visiri Hand Fan
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Custom traditional wedding printed visiri hand fans. Choose a professional PSD template to begin.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateUploadCard
            category="traditional-utility-items"
            subcategory="printed-visiri-hand-fan"
          />
          {TEMPLATES.map(t => (
            <TemplateCard
              key={t.id}
              id={t.id}
              name={t.name}
              previewUrl={t.preview}
              category="traditional-utility-items"
              subcategory="printed-visiri-hand-fan"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
