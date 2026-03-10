"use client";

import { useState, useEffect } from "react";
import * as fabric from "fabric";
import Mockup3DViewer from "./Mockup3DViewer";

interface MockupPreviewProps {
    psdFilename: string;
    productType: string;
    active: boolean;
    canvas: fabric.Canvas | null;
    onClose: () => void;
    isIntegrated?: boolean;
}

export default function MockupPreview({
    psdFilename,
    productType,
    active,
    canvas,
    onClose,
    isIntegrated = false
}: MockupPreviewProps) {
    const [designUrl, setDesignUrl] = useState<string | null>(null);

    useEffect(() => {
        if ((active || isIntegrated) && canvas) {
            const updatePreview = () => {
                const url = canvas.toDataURL({
                    format: 'png',
                    quality: 1,
                    multiplier: 2
                });
                setDesignUrl(url);
            };

            updatePreview();

            if (isIntegrated) {
                canvas.on('object:modified', updatePreview);
                canvas.on('object:added', updatePreview);
                canvas.on('object:removed', updatePreview);

                // Real-time updates during manipulation
                canvas.on('object:moving', updatePreview);
                canvas.on('object:scaling', updatePreview);
                canvas.on('object:rotating', updatePreview);

                return () => {
                    canvas.off('object:modified', updatePreview);
                    canvas.off('object:added', updatePreview);
                    canvas.off('object:removed', updatePreview);
                    canvas.off('object:moving', updatePreview);
                    canvas.off('object:scaling', updatePreview);
                    canvas.off('object:rotating', updatePreview);
                };
            }
        }
    }, [active, isIntegrated, canvas]);

    if (!active && !isIntegrated) return null;

    const content = (
        <div
            className={`flex flex-col md:flex-row h-full transition-all duration-500 relative ${isIntegrated ? 'w-full' : 'bg-[#f4f7fa] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden max-w-6xl w-full h-[90vh] border border-white/50'}`}
        >
            {/* Left: Product Preview (TRUE 3D WEBGL) */}
            <div
                className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden ${isIntegrated ? 'bg-transparent' : 'bg-[#eef2f6]'}`}
            >
                <div className="w-full h-full relative z-0">
                    <Mockup3DViewer
                        designUrl={designUrl}
                        productType={productType}
                    />
                </div>

                {/* 3D Indicator Badge */}
                {!isIntegrated && (
                    <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-white shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-left duration-1000 z-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                        <span className="text-[11px] font-black text-pink-900 uppercase tracking-[0.2em]">Live 3D Studio</span>
                    </div>
                )}
            </div>

            {/* Right: Info & Actions */}
            {!isIntegrated && (
                <div className="w-full md:w-[400px] p-12 flex flex-col gap-10 bg-white/50 backdrop-blur-md border-l border-white/50 relative z-[60]">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[11px] font-black text-pink-500 uppercase tracking-[0.3em] mb-3 block">Premium Experience</span>
                            <h2 className="text-4xl font-serif font-black text-gray-900 leading-none tracking-tight">
                                Workspace <br /><span className="text-gray-400 italic">Preview</span>
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white hover:bg-pink-50 text-gray-400 hover:text-pink-600 transition-all border border-gray-100 shadow-sm group"
                        >
                            <span className="group-hover:rotate-90 transition-transform duration-500 text-2xl font-light">✕</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-8">
                        <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-6 opacity-30">Studio Tech Specs</h4>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">Rendering Hub</span>
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Real-Time WebGL</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">3D Engine</span>
                                    <span className="text-xs font-black text-gray-900 uppercase">Three.js R183</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={onClose}
                            className="w-full py-6 bg-linear-to-r from-gray-900 to-black text-white rounded-[2rem] font-black text-[13px] uppercase tracking-widest shadow-2xl hover:bg-pink-600 hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Confirm Design
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (isIntegrated) return content;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-xl p-8 animate-in fade-in zoom-in-95 duration-500">
            {content}
        </div>
    );
}
