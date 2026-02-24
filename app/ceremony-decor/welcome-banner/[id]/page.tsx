"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import EditorCanvas from "@/components/welcome-banner/EditorCanvas";
import Sidebar from "@/components/welcome-banner/Sidebar";
import Toolbar from "@/components/welcome-banner/Toolbar";
import TextPanel from "@/components/welcome-banner/TextPanel";
import ElementsPanel from "@/components/welcome-banner/ElementsPanel";
import ShapesPanel from "@/components/welcome-banner/ShapesPanel";
import UploadsPanel from "@/components/welcome-banner/UploadPanel";
import { useFabricEditor } from "@/hooks/useFabricEditor";
import { exportAsPNG, exportAsPDF } from "@/utils/export";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const canvasElementRef = useRef<HTMLCanvasElement>(null);

  const {
    canvas,
    initCanvas,
    addText,
    selectedObject,
    deleteSelected,
    undo,
    redo,
    zoom,
    handleZoom,
    addSafeArea,
    toggleLock,
    resizeCanvas,
    disposeCanvas,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    setOpacity,
    setFontFamily,
  } = useFabricEditor();

  const [activePanel, setActivePanel] = useState<"text" | "elements" | "uploads" | "shapes">("text");

  let width = 400;
  let height = 600;

  if (params.id) {
    const parts = (params.id as string).split("x");
    const w = Number(parts[0]);
    const h = Number(parts[1]);
    if (!isNaN(w) && !isNaN(h)) {
      width = w * 100;
      height = h * 100;
    }
  }

  const qWidth = searchParams.get("width");
  const qHeight = searchParams.get("height");

  if (qWidth && qHeight) {
    const w = Number(qWidth);
    const h = Number(qHeight);
    if (!isNaN(w) && !isNaN(h)) {
      width = w * 100;
      height = h * 100;
    }
  }

  // 1. Initial Mount: Setup Canvas
  useEffect(() => {
    if (canvasElementRef.current) {
      console.log("Fabric Hook: Initialization Check");
      const c = initCanvas(canvasElementRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
      });

      if (c) {
        addSafeArea(c);
      }

      return () => {
        console.log("Fabric Hook: Disposing");
        disposeCanvas();
      };
    }
  }, [initCanvas, addSafeArea, disposeCanvas]); // Include dependencies

  // 2. Handle Resizing (when params/width/height change)
  useEffect(() => {
    if (canvas) {
      console.log("Updating dimensions:", width, height);
      resizeCanvas(width, height);
    }
  }, [width, height, canvas, resizeCanvas]);

  // 3. Setup Global Listeners & Cleanup
  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          deleteSelected();
        }
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          undo();
        } else if (e.key === "y" || (e.shiftKey && e.key === "Z")) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("Unmounting: Disposing Canvas");
      window.removeEventListener("keydown", handleKeyDown);
      // Canvas disposal is handled by initCanvas's defensive check, 
      // but we should still clear state if needed. 
      // In Next.js/React, we typically let the hook or a ref handle the shared instance.
    };
  }, [canvas, deleteSelected, undo, redo]);

  const handleDownload = (format: "png" | "pdf") => {
    if (!canvas) return;
    if (format === "png") {
      exportAsPNG(canvas, "wedding-banner.png");
    } else {
      exportAsPDF(canvas, width, height, "wedding-banner.pdf");
    }
  };

  return (
    <div className="flex h-[calc(100vh-96px)] bg-gray-50 overflow-hidden font-sans">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {/* 🧰 PANEL CONTENT */}
      <div className="w-80 bg-white border-r overflow-y-auto overflow-x-hidden shadow-sm z-10">
        {activePanel === "text" && (
          <TextPanel
            addText={addText}
            selectedObject={selectedObject}
            setFontFamily={setFontFamily}
          />
        )}
        {activePanel === "elements" && <ElementsPanel canvas={canvas} />}
        {activePanel === "shapes" && <ShapesPanel canvas={canvas} />}
        {activePanel === "uploads" && <UploadsPanel canvas={canvas} />}
      </div>

      {/* 🎨 MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        <Toolbar
          canvas={canvas}
          undo={undo}
          redo={redo}
          download={handleDownload}
          toggleLock={toggleLock}
          selectedObject={selectedObject}
          bringToFront={bringToFront}
          sendToBack={sendToBack}
          bringForward={bringForward}
          sendBackward={sendBackward}
          setOpacity={setOpacity}
        />

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <EditorCanvas
            width={width}
            height={height}
            canvasRef={canvasElementRef}
          />

          {/* Zoom Controls Overlay */}
          <div className="absolute bottom-6 right-6 flex bg-white shadow-lg rounded-full px-4 py-2 gap-4 items-center border border-gray-100 z-40">
            <button
              onClick={() => handleZoom(zoom - 0.1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors font-bold text-xl"
            >
              −
            </button>
            <span className="text-xs font-bold text-gray-700 min-w-[50px] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom(zoom + 0.1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors font-bold text-xl"
            >
              +
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
