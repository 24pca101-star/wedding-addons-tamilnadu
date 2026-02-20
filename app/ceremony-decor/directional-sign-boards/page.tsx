'use client';

import React, { useState } from 'react';
import SizeSelector from '@/components/directional-sign/SizeSelector';
import Editor from '@/components/directional-sign/Editor';

interface SizeOption {
  id: string;
  name: string;
  dimensions: string;
  ratio: number;
}

export default function DirectionalSignBoards() {
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  if (selectedSize) {
    return <Editor size={selectedSize} onBack={() => setSelectedSize(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-cream/20 py-16 px-6 border-b border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-maroon mb-4">
            Custom Wedding Directional Signs
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            வழிகாட்டி பலகைகள் - Guide your guests with elegance and style.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        <SizeSelector onSelect={setSelectedSize} />
      </main>

      {/* Luxury Footer Decor */}
      <div className="flex justify-center py-12 opacity-30">
        <div className="w-32 h-px bg-gold" />
        <div className="mx-4 text-gold italic font-serif">Luxury Wedding Collection</div>
        <div className="w-32 h-px bg-gold" />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        :root {
          --gold: #D4AF37;
          --maroon: #800000;
          --cream: #FFFDD0;
        }

        body {
          font-family: 'Outfit', sans-serif;
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .bg-gold { background-color: var(--gold); }
        .text-gold { color: var(--gold); }
        .border-gold { border-color: var(--gold); }
        
        .bg-maroon { background-color: var(--maroon); }
        .text-maroon { color: var(--maroon); }

        .bg-cream { background-color: var(--cream); }
      `}</style>
    </div>
  );
}

