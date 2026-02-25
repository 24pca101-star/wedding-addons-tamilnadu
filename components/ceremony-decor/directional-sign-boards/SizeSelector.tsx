'use client';

import React from 'react';

interface SizeOption {
    id: string;
    name: string;
    dimensions: string;
    ratio: number; // width / height
    description: string;
    visualLabel: string;
    widthInFeet: number;
}

const sizes: SizeOption[] = [
    {
        id: 'small',
        name: 'Small (A3 Landscape)',
        dimensions: '16.5 x 11.7 inches / A3',
        ratio: 16.5 / 11.7,
        description: 'Standard A3 size, perfect for intimate garden paths or indoor directions.',
        visualLabel: 'A3',
        widthInFeet: 1.375 // 16.5 inches
    },
    {
        id: 'medium',
        name: 'Medium (Professional)',
        dimensions: '24x18 inches / 2x1.5 feet',
        ratio: 24 / 18,
        description: 'The standard choice for most wedding venues.',
        visualLabel: '2ft × 1.5ft',
        widthInFeet: 2
    },
    {
        id: 'large',
        name: 'Large (Grand)',
        dimensions: '36x24 inches / 3x2 feet',
        ratio: 36 / 24,
        description: 'Bold and clear for large outdoor areas or main entrances.',
        visualLabel: '3ft × 2ft',
        widthInFeet: 3
    },
    {
        id: 'extra-large',
        name: 'Event (Panoramic)',
        dimensions: '48x24 inches / 4x2 feet',
        ratio: 48 / 24,
        description: 'The ultimate wide format for professional wedding garden venues.',
        visualLabel: '4ft × 2ft',
        widthInFeet: 4
    }
];

interface SizeSelectorProps {
    onSelect: (size: SizeOption) => void;
}

export default function SizeSelector({ onSelect }: SizeSelectorProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
            <div className="text-center mb-12 animate-fadeIn">
                <h2 className="text-4xl font-serif text-maroon mb-4">Choose Your Sign Size</h2>
                <p className="text-gray-600 max-w-lg">
                    Select the perfect landscape dimensions for your directional sign.
                    All sizes are optimized for high-resolution wedding photography and print.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {sizes.map((size) => (
                    <div
                        key={size.id}
                        onClick={() => onSelect(size)}
                        className="group cursor-pointer bg-white border border-gold/20 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gold transition-all duration-300 opacity-0 group-hover:opacity-100" />

                        <div className="h-48 w-full flex flex-col items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <div className="relative flex items-center justify-center">
                                <div
                                    className="bg-white border-2 border-maroon shadow-md flex items-center justify-center relative transition-all duration-300 group-hover:shadow-lg"
                                    style={{
                                        width: `${size.widthInFeet * 60}px`, // 1ft = 60px scale
                                        aspectRatio: `${size.ratio}`,
                                        maxWidth: '100%'
                                    }}
                                >
                                    <div className="absolute inset-1 border border-gold/30 pointer-events-none" />
                                </div>
                                {/* Label floating below/inside or overlay */}
                                <span className="absolute text-maroon font-serif font-bold text-sm bg-white/90 px-2 py-1 rounded shadow-sm border border-gold/20 whitespace-nowrap z-10" style={{ bottom: '-2rem' }}>
                                    {size.visualLabel}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-serif text-gray-800 mb-2">{size.name}</h3>
                        <p className="text-maroon font-bold mb-4 bg-gold/5 px-4 py-1 rounded-full text-sm">{size.dimensions}</p>
                        <p className="text-gray-500 text-sm leading-relaxed">{size.description}</p>

                        <button className="mt-8 px-8 py-2.5 bg-white border-2 border-gold text-gold rounded-full font-bold hover:bg-gold hover:text-white transition-all transform group-hover:scale-105 active:scale-95">
                            Select Size
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
