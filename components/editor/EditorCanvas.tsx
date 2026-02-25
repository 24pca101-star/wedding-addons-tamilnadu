"use client";

import React from "react";

type Props = {
    width: number;
    height: number;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function EditorCanvas({ width, height, canvasRef }: Props) {
    return (
        <div id="editor-workspace" className="flex-1 flex items-center justify-center bg-[#f0f2f5] overflow-auto p-20 min-h-0 custom-scrollbar">
            <div
                className="relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white transition-all duration-300 ease-in-out"
            >
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="block"
                />
            </div>
        </div>
    );
}
