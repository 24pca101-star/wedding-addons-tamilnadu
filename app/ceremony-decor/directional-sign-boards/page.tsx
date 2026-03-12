"use client";

const BOARD_TYPES = [
  { id: 'easel-arch', name: 'Luxury Arch-Top Easel', desc: 'Premium Gold Finish' },
  { id: 'stake-floral', name: 'Floral Garden Stake', desc: 'Romantic Rose Background' },
  { id: 'easel-black-floral', name: 'Black Floral Easel', desc: 'Eucalyptus Decor' },
  { id: 'easel-white', name: 'White Minimalist Easel', desc: 'Clean Modern Studio' },
  { id: 'easel-pre-gold', name: 'Gold & Acrylic', desc: 'Modern Luxury Style' },
  { id: 'easel-pre-vintage', name: 'Vintage Ornate', desc: 'Classic White Frame' },
  { id: 'easel-pre-black', name: 'Stylish Black', desc: 'Modern Black with Roses' },
  { id: 'easel-custom-darkwood', name: 'Dark Wood Roses', desc: 'Elegant Mauve Florals' },
  { id: 'easel-custom-hanging', name: 'Hanging Gold Frame', desc: 'Pink Drapes & Roses' },
  { id: 'easel-custom-round', name: 'Round White Easel', desc: 'Minimalist Floral Circle' },
];

export default function DirectionalSignBoards() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-pink-900 font-serif mb-4 uppercase tracking-tighter">
            Directional Sign Boards
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto italic">
            "Guide your guests with elegance. Custom realistic wedding sign boards for every venue style."
          </p>
          <div className="mt-8 h-1 w-24 mx-auto bg-pink-100 rounded-full" />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {BOARD_TYPES.map((board) => (
            <div key={board.id} className="group flex flex-col h-full bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-gray-100/50 hover:scale-[1.02] relative overflow-hidden">
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50/50 mb-6 group-hover:bg-white transition-colors duration-500">
                <img
                  src={`/assets/mockups/directional-boards/${board.id}.png`}
                  alt={board.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Info & Actions */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight group-hover:text-pink-600 transition-colors">
                    {board.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">{board.desc}</p>
                </div>

                <div className="mt-auto">
                  <a
                    href={`/editor/ceremony-decor/directional-sign-boards?template=blank&bagType=${board.id}`}
                    className="flex items-center justify-center py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg shadow-gray-200 hover:shadow-pink-200 active:scale-95 w-full"
                  >
                    Custom
                  </a>
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
