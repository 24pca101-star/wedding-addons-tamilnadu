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
    <div id="editor-workspace" className="flex-1 flex items-center justify-center bg-[#f0f2f5] overflow-auto p-10 md:p-20 min-h-0 custom-scrollbar">
      {/* Outer wrapper that defines the scrollable area based on zoomed dimensions */}
      <div
        className="flex-shrink-0"
        style={{
          width: width * zoom,
          height: height * zoom,
          position: 'relative',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div
          className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white"
          style={{
            width: width,
            height: height,
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease-in-out',
            flexShrink: 0
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
