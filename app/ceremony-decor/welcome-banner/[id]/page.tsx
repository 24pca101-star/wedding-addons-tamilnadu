"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import EditorCanvas from "@/components/ceremony-decor/welcome-banner/EditorCanvas";
import Sidebar from "@/components/ceremony-decor/welcome-banner/Sidebar";
import Toolbar from "@/components/ceremony-decor/welcome-banner/Toolbar";
import TextPanel from "@/components/ceremony-decor/welcome-banner/TextPanel";
import ElementsPanel from "@/components/ceremony-decor/welcome-banner/ElementsPanel";
import ShapesPanel from "@/components/ceremony-decor/welcome-banner/ShapesPanel";
import UploadsPanel from "@/components/ceremony-decor/welcome-banner/UploadPanel";
import { useFabricEditor } from "@/hooks/useFabricEditor";
import { exportAsPNG, exportAsPDF } from "@/utils/export";
import { exportViaPsdService } from "@/utils/psdExport";

import { FabricProvider, useFabric } from "@/context/FabricContext";

function EditorContent() {
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
    previewUrl,
    psdMetadata,
    loadPsdTemplate,
  } = useFabric();

  const [activePanel, setActivePanel] = useState<"text" | "elements" | "uploads" | "shapes">("text");
  const template = searchParams.get("template");

  let width = 400;
  let height = 600;

  if (params.id && params.id !== "editor") {
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

  useEffect(() => {
    if (canvasElementRef.current) {
      console.log("Fabric Editor: Initializing Canvas");
      const c = initCanvas(canvasElementRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
      });

      if (c && template && template !== "blank") {
        loadPsdTemplate(template, c);
      } else if (c) {
        addSafeArea(c);
      }

      return () => {
        console.log("Fabric Editor: Disposing Canvas");
        disposeCanvas();
      };
    }
  }, [initCanvas, disposeCanvas, template, loadPsdTemplate, width, height, addSafeArea]);

  // Handle key listeners
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canvas, deleteSelected, undo, redo]);

  const handleDownload = async (format: "png" | "pdf") => {
    if (!canvas) return;

    if (template && template !== "blank") {
      const success = await exportViaPsdService(canvas, template, format === "pdf" ? "pdf" : "png");
      if (success) return;
    }

    if (format === "png") {
      exportAsPNG(canvas, "wedding-banner.png");
    } else {
      exportAsPDF(canvas, width, height, "wedding-banner.pdf");
    }
  };

  return (
    <div className="flex h-[calc(100vh-96px)] bg-gray-50 overflow-hidden font-sans">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      <div className="w-80 bg-white border-r overflow-y-auto overflow-x-hidden shadow-sm z-10">
        {activePanel === "text" && (
          <TextPanel />
        )}
        {activePanel === "elements" && <ElementsPanel />}
        {activePanel === "shapes" && <ShapesPanel />}
        {activePanel === "uploads" && <UploadsPanel />}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Toolbar
          download={handleDownload}
        />

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <EditorCanvas
            width={psdMetadata?.width || width}
            height={psdMetadata?.height || height}
            canvasRef={canvasElementRef}
            previewUrl={previewUrl}
            zoom={zoom}
          />

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

export default function Page() {
  return (
    <FabricProvider>
      <EditorContent />
    </FabricProvider>
  );
}
