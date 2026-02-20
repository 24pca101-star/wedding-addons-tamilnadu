'use client';

import React from 'react';
import { CALENDAR_SIZES } from '@/lib/calendar-presets';

interface SizeOption {
    id: string;
    name: string;
    dimensions: string;
    width: number;
    height: number;
    description: string;
}

interface SizeSelectorProps {
    onSelect: (size: SizeOption) => void;
}

export default function SizeSelector({ onSelect }: SizeSelectorProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 bg-[#FDFBF7]">
            <div className="text-center mb-16 animate-fadeIn">
                <div className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-gold/20">
                    Premium Stationery
                </div>
                <h2 className="text-5xl font-serif text-maroon mb-6 leading-tight">
                    Select Your Mini <br /> Calendar Format
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                    Choose from our collection of bespoke sizes, each optimized for precision printing and elegant gifting. Perfect for wedding favors and keepsakes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
                {CALENDAR_SIZES.map((size) => (
                    <div
                        key={size.id}
                        onClick={() => onSelect(size)}
                        className="group cursor-pointer bg-white border border-gold/10 rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(128,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden active:scale-95 border-b-[6px] border-b-gold/5 hover:border-b-maroon"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <span className="text-4xl">✨</span>
                        </div>

                        <div className="w-24 h-24 bg-cream/30 rounded-full flex items-center justify-center mb-8 border border-gold/20 group-hover:bg-maroon group-hover:border-maroon transition-all duration-500">
                            <div className="flex flex-col items-center group-hover:text-white transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Format</span>
                                <span className="text-xl font-serif font-bold italic">
                                    {size.id === 'folded' ? 'Fold' : 'Mini'}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl font-serif font-bold text-gray-800 mb-2 truncate w-full px-2 group-hover:text-maroon transition-colors">{size.name}</h3>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-6 bg-gold/30" />
                            <p className="text-maroon font-black text-[12px] uppercase tracking-widest">{size.dimensions}</p>
                            <div className="h-px w-6 bg-gold/30" />
                        </div>

                        <p className="text-gray-400 text-[11px] leading-relaxed font-medium mb-8 flex-1">
                            {size.description}
                        </p>

                        <button className="w-full py-4 bg-[#FBF9F4] border border-gold/20 text-maroon text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-300 shadow-sm flex items-center justify-center gap-3 active:scale-95">
                            Start Customizing
                            <span className="text-sm opacity-60 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Aesthetic Footer Decor */}
            <div className="mt-20 flex items-center gap-4 opacity-20">
                <div className="w-48 h-px bg-gold" />
                <div className="text-maroon font-serif italic text-sm">Luxury Gift Collection</div>
                <div className="w-48 h-px bg-gold" />
            </div>
        </div>
    );
}
