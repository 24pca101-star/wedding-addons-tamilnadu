"use client";

import { useEffect, useRef, useState } from "react";
import { readPsd } from "ag-psd";
import * as fabric  from "fabric";
import { addPsdLayersToFabricCanvas } from "./psdToFabricUtil";

interface EditorProps {
  psdUrl: string;
  jpgUrl?: string;
  setSelectedObject?: (obj: fabric.Object | null) => void;
  setCanvasRef?: (canvas: fabric.Canvas) => void;
}

export default function PsdEditor({
  psdUrl,
  jpgUrl,
  setSelectedObject,
  setCanvasRef,
}: EditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPsd() {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching PSD:", psdUrl);

        const res = await fetch(psdUrl);

        // 🔴 Check response type (prevents <!DOCTYPE error)
        const contentType = res.headers.get("content-type");
        console.log("Content-Type:", contentType);

        if (!res.ok || contentType?.includes("text/html")) {
          throw new Error("PSD file not found or wrong path");
        }

        const arrayBuffer = await res.arrayBuffer();

        // 🔴 Ensure it's a real PSD (starts with 8BPS)
        const signature = String.fromCharCode(
          ...new Uint8Array(arrayBuffer.slice(0, 4))
        );
        if (signature !== "8BPS") {
          throw new Error("Invalid PSD file signature");
        }

        const psd = readPsd(arrayBuffer);

        if (!psd.width || !psd.height) {
          throw new Error("Invalid PSD: missing dimensions");
        }

        if (!canvasRef.current) throw new Error("Canvas not ready");
        // Dispose existing canvas (prevents duplicate initialization)
        if (fabricRef.current) {
            fabricRef.current.dispose();
            fabricRef.current = null;
        }

        // ✅ Create Fabric Canvas
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: psd.width,
          height: psd.height,
          preserveObjectStacking: true,
        });

        fabricRef.current = fabricCanvas;
        setCanvasRef?.(fabricCanvas);

        // ✅ Add PSD layers
        addPsdLayersToFabricCanvas(psd, fabricCanvas);

        // ✅ Background JPG (optional)
        if (jpgUrl) {
          fabric.Image.fromURL(jpgUrl)
            .then((img) => {
              img.set({ selectable: false, evented: false });
              fabricCanvas.backgroundImage = img;
              fabricCanvas.renderAll();
            })
            .catch(() => setError("Failed to load background image"));
        }

        // ✅ Selection events for Canva panel
        fabricCanvas.on("selection:created", (e) =>
          setSelectedObject?.(e.selected?.[0] || null)
        );
        fabricCanvas.on("selection:updated", (e) =>
          setSelectedObject?.(e.selected?.[0] || null)
        );
        fabricCanvas.on("selection:cleared", () =>
          setSelectedObject?.(null)
        );

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load PSD editor";
        console.error("Editor Error:", err);
        setError(errorMessage);
      }

      setLoading(false);
    }

    loadPsd();

    return () => {
      fabricRef.current?.dispose();
    };
  }, [psdUrl, jpgUrl, setSelectedObject, setCanvasRef]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          Loading editor...
        </div>
      )}

      {error && <div className="text-red-500">{error}</div>}

      <canvas ref={canvasRef} className="border shadow" />
    </div>
  );
}
