"use client";
import TemplateCard from "@/components/TemplateCard";
import TemplateUploadCard from "@/components/TemplateUploadCard";

const BAG_TYPES = [
  { id: 'totebag1', name: 'Premium Canvas Tote', desc: 'Natural White Texture' },
  { id: 'totebag2', name: 'Luxury Cotton Bag', desc: 'Soft Cream Finish' },
  { id: 'totebag4', name: 'Eco-Friendly Jute', desc: 'Traditional Hessian' },
  { id: 'totebag5', name: 'Satin Wedding Pouch', desc: 'Glossy Silk Feel' },
  { id: 'totebag6', name: 'Mini Welcome Bag', desc: 'Compact Gift Style' },
];

import { getTemplates } from "@/lib/templates";
const CATEGORY = "guest-gift-keepsakes";
const SUBCATEGORY = "welcome-tote-bag";
const TEMPLATES = getTemplates(CATEGORY, SUBCATEGORY);

export default function WelcomeToteBag() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-6">
            Welcome Tote Bag
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto italic">
            "Carry your wedding memories. Custom realistic cotton tote bags for your special guest gifts."
          </p>
          <div className="mt-8 h-1 w-24 mx-auto bg-pink-100 rounded-full" />
        </header>

        {/* Templates Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Design Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <TemplateUploadCard 
            category="guest-gift-keepsakes"
            subcategory="welcome-tote-bag"
          />
            {TEMPLATES.map(t => (
              <TemplateCard
                key={t.id}
                id={t.id}
                name={t.name}
                previewUrl={`http://localhost:5005/preview/${t.preview}`}
                category="guest-gift-keepsakes"
                subcategory="welcome-tote-bag"
              />
            ))}
          </div>
        </section>

        <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Blank Bag Styles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {BAG_TYPES.map((bag) => (
            <div key={bag.id} className="group flex flex-col h-full bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-gray-100/50 hover:scale-[1.02] relative overflow-hidden">
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50/50 mb-6 group-hover:bg-white transition-colors duration-500">
                <img
                  src={`/storage/mockups/guest-gift-keepsakes/welcome-tote-bag/${bag.id}/white bag.png`}
                  alt={bag.name}
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/storage/assets/blank-canvas.png';
                  }}
                />

                {/* Floating 3D Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">3D View</span>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight group-hover:text-pink-600 transition-colors">
                    {bag.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">{bag.desc}</p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <a
                    href={`/editor/guest-gift-keepsakes/welcome-tote-bag?template=blank&bagType=${bag.id}`}
                    className="flex items-center justify-center py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg shadow-gray-200 hover:shadow-pink-200 active:scale-95"
                  >
                    Custom
                  </a>
                  <button
                    className="flex items-center justify-center py-3.5 bg-white border border-gray-100 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-default group-hover:text-gray-900 group-hover:border-gray-200 transition-all"
                  >
                    3D Design
                  </button>
                </div>
              </div>

              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-tr from-pink-100/0 via-pink-100/10 to-pink-100/0 rounded-[3rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
