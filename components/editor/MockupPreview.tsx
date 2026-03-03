"use client";

import { useState, useEffect } from "react";
import { Canvas } from "fabric";
import { getCanvasEdits } from "@/utils/canvasEdits";

interface MockupPreviewProps {
    psdFilename: string;
    productType: string;
    active: boolean;
    canvas: Canvas | null;
    onClose: () => void;
}

export default function MockupPreview({ psdFilename, productType, active, canvas, onClose }: MockupPreviewProps) {
    const [designUrl, setDesignUrl] = useState<string | null>(null);

    useEffect(() => {
        if (active && canvas) {
            // Instant capture of the design
            const url = canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 2 // High resolution
            });
            setDesignUrl(url);
        }
    }, [active, canvas]);

    if (!active) return null;

    const mockupBase = `/assets/mockups/tote-bag`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row h-[80vh]">
                {/* Left: Product Preview (TRUE REAL-TIME COMPOSITE) */}
                <div className="flex-1 bg-[#f8f8f8] flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center max-w-[500px] max-h-[500px]">
                        {/* 1. Base Image (The White Bag) */}
                        <img
                            src={`${mockupBase}/white bag.png`}
                            alt="Bag Base"
                            className="max-w-full max-h-full object-contain z-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `${mockupBase}/base.png`;
                            }}
                        />

                        {/* 2. Design Overlay with Masking */}
                        {designUrl && (
                            <div
                                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                                style={{
                                    WebkitMaskImage: `url(${mockupBase}/mask.png)`,
                                    maskImage: `url(${mockupBase}/mask.png)`,
                                    WebkitMaskSize: 'contain',
                                    maskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                }}
                            >
                                <img
                                    src={designUrl}
                                    alt="Design"
                                    className="max-w-full max-h-full object-contain opacity-85 scale-[0.6] translate-y-[6%]"
                                />
                            </div>
                        )}

                        {/* 3. Shadow Overlay */}
                        <img
                            src={`${mockupBase}/shadow.png`}
                            alt="Shadow Overlay"
                            className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none mix-blend-multiply opacity-60"
                        />
                    </div>
                </div>

                {/* Right: Info & Actions */}
                <div className="w-full md:w-80 p-8 flex flex-col gap-6 bg-white border-l">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-serif font-black text-pink-900 border-b-2 border-pink-100 pb-2 mb-2 capitalize">
                                Real-Time Preview
                            </h2>
                            <p className="text-xs text-rose-500 font-bold tracking-widest uppercase">Instant Browser Render</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all border border-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                            "Live changes. No waiting. Professional results."
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50 shadow-sm">
                                <h4 className="text-[10px] font-bold text-pink-800 uppercase tracking-tighter mb-1">Rendering Engine</h4>
                                <p className="text-[10px] text-pink-600">Pure Client-Side CSS Compositing</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-linear-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all active:scale-95"
                        >
                            Confirm & Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
