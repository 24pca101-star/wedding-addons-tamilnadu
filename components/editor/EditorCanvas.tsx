"use client";

import React from "react";

type Props = {
    width: number;
    height: number;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    previewUrl?: string | null;
    zoom?: number;
    bgImage?: string | null;
};

export default function EditorCanvas({
    width,
    height,
    canvasRef,
    previewUrl,
    zoom = 1,
    bgImage
}: Props) {
    return (
        <div id="editor-workspace" className={`flex-1 flex items-center justify-center overflow-auto p-4 md:p-10 min-h-0 custom-scrollbar relative ${bgImage ? 'bg-white' : 'bg-[#f2f3f5]'}`}>
            <div
                className={`relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${bgImage ? 'bg-transparent' : 'shadow-[0_24px_50px_rgb(0,0,0,0.15)] bg-white rounded-2xl overflow-hidden'}`}
                style={{
                    width: width,
                    height: height,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center'
                }}
            >
                {/* Product Background (e.g. the Bag) */}
                {bgImage && (
                    <div className="absolute inset-[-80px] z-0 flex items-center justify-center pointer-events-none">
                        <img
                            src={bgImage}
                            alt="Product Background"
                            className="w-full h-full object-contain opacity-100 scale-125 transition-transform duration-1000"
                        />
                        {/* Subtle fabric overlay for the design area */}
                        <div className="absolute inset-[80px] bg-black/5 rounded-sm mix-blend-multiply pointer-events-none border border-black/5" />
                    </div>
                )}

                {/* The Editable Fabric Canvas */}
                <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
                    <canvas
                        ref={canvasRef}
                        className="block"
                    />
                </div>
            </div>
        </div>
    );
}
