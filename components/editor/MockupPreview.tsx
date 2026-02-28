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
    const [mockupUrl, setMockupUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateMockup = async () => {
        if (!psdFilename) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/generate-mockup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    psdFilename,
                    productType,
                    edits: canvas ? getCanvasEdits(canvas) : [],
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                setMockupUrl(URL.createObjectURL(blob));
            }
        } catch (error) {
            console.error("Failed to fetch mockup:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (active) {
            generateMockup();
        }
    }, [active]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row h-[80vh]">
                {/* Left: Product Preview */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-rose-50/50 via-transparent to-amber-50/50 pointer-events-none" />

                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 font-medium font-serif italic">Rendering Reality...</p>
                        </div>
                    ) : mockupUrl ? (
                        <img
                            src={mockupUrl}
                            alt="Mockup Preview"
                            className="max-w-full max-h-full object-contain drop-shadow-2xl animate-in zoom-in-95 duration-500"
                        />
                    ) : (
                        <p className="text-gray-400">Failed to generate preview</p>
                    )}
                </div>

                {/* Right: Info & Actions */}
                <div className="w-full md:w-80 p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-serif font-black text-pink-900 border-b-2 border-pink-100 pb-2 mb-2 capitalize">
                                {productType.replace('-', ' ')}
                            </h2>
                            <p className="text-xs text-rose-500 font-bold tracking-widest uppercase">Premium Real-Time Render</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all border border-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Experience your design in a realistic context. Our rendering engine uses professional blending to simulate natural light, shadows, and textures.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50">
                                <h4 className="text-[10px] font-bold text-pink-800 uppercase tracking-tighter mb-1">Rendering Engine</h4>
                                <p className="text-[10px] text-pink-600">Aspose.PSD + SkiaSharp + Sharp</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={generateMockup}
                            className="w-full py-4 bg-white border-2 border-pink-200 text-pink-700 rounded-2xl font-bold text-sm hover:bg-pink-50 transition-all hover:border-pink-300 active:scale-95"
                        >
                            Update Preview
                        </button>
                        <button
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
