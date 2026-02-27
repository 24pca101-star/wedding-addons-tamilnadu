"use client";

import React from "react";

type Props = {
    width: number;
    height: number;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    previewUrl?: string | null;
    zoom?: number;
};

export default function EditorCanvas({ width, height, canvasRef, previewUrl, zoom = 1 }: Props) {
    return (
        <div id="editor-workspace" className="flex-1 flex items-center justify-center bg-[#f0f2f5] overflow-auto p-20 min-h-0 custom-scrollbar">
            <div
                className="relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white transition-all duration-300 ease-in-out"
                style={{
                    width: width,
                    height: height,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center'
                }}
            >
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
