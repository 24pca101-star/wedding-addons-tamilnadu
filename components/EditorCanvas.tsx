"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";

type FabricCanvas = fabric.Canvas;

type Props = {
  setCanvas: (canvas: FabricCanvas) => void;
  width: number;
  height: number;
};

export default function EditorCanvas({ setCanvas, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
    });

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height, setCanvas]);

  return (
    <div
      style={{
        background: '#f3f4f6',
        border: '2px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 4px 24px #0001',
        padding: 24,
        margin: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: height + 48,
        minWidth: width + 48,
        maxWidth: '100vw',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          background: '#fff',
          border: '2px solid #f709a3',
          borderRadius: 8,
          boxShadow: '0 2px 12px #f709a355',
          display: 'block',
        }}
      />
     
    </div>
    
  );
}


