"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import EditorCanvas from "@/components/editor/EditorCanvas";
import Sidebar from "@/components/editor/Sidebar";
import Toolbar from "@/components/editor/Toolbar";
import TextPanel from "@/components/editor/TextPanel";
import ElementsPanel from "@/components/editor/ElementsPanel";
import ShapesPanel from "@/components/editor/ShapesPanel";
import UploadsPanel from "@/components/editor/UploadPanel";
import { exportAsPNG, exportAsPDF } from "@/utils/export";
import { exportViaPsdService } from "@/utils/psdExport";
import { FabricProvider, useFabric } from "@/context/FabricContext";
import MockupPreview from "@/components/editor/MockupPreview";

import { Suspense } from "react";

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
        loadPsdTemplate,
        previewUrl,
        psdMetadata,
    } = useFabric();

    const [activePanel, setActivePanel] = useState<"text" | "elements" | "uploads" | "shapes">("text");
    const [showMockup, setShowMockup] = useState(false);

    // In Next.js 15+, useParams() returns a plain object on the client, but we should handle it safely.
    const category = params?.category as string;
    const subcategory = params?.subcategory as string;
    const template = searchParams.get("template");

    // Dynamic dimensions from metadata if available, else canvas, else default
    const canvasWidth = psdMetadata?.width || canvas?.width || 400;
    const canvasHeight = psdMetadata?.height || canvas?.height || 600;

    useEffect(() => {
        if (canvasElementRef.current && category && subcategory) {
            console.log(`Universal Editor: Initializing Canvas for ${category}/${subcategory}`);
            const c = initCanvas(canvasElementRef.current, {
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: "transparent",
            });

            if (c && template && template !== "blank") {
                loadPsdTemplate(template, c);
            } else if (c) {
                addSafeArea(c);
            }

            return () => {
                console.log("Universal Editor: Disposing Canvas");
                disposeCanvas();
            };
        }
    }, [initCanvas, disposeCanvas, template, loadPsdTemplate, addSafeArea, category, subcategory]);

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
            exportAsPNG(canvas, `${subcategory || "design"}.png`);
        } else {
            exportAsPDF(canvas, canvasWidth, canvasHeight, `${subcategory || "design"}.pdf`);
        }
    };

    if (!category || !subcategory) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Loading Editor...</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-96px)] bg-gray-50 overflow-hidden font-sans">
            <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

            <div className="w-80 bg-white border-r overflow-y-auto overflow-x-hidden shadow-sm z-10">
                {activePanel === "text" && <TextPanel />}
                {activePanel === "elements" && <ElementsPanel />}
                {activePanel === "shapes" && <ShapesPanel />}
                {activePanel === "uploads" && <UploadsPanel />}
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <Toolbar
                    download={handleDownload}
                    onShowMockup={() => setShowMockup(true)}
                />

                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <EditorCanvas
                        width={canvasWidth}
                        height={canvasHeight}
                        canvasRef={canvasElementRef}
                        previewUrl={previewUrl}
                        zoom={zoom}
                    />

                    <MockupPreview
                        active={showMockup}
                        onClose={() => setShowMockup(false)}
                        psdFilename={template || "design-1.psd"}
                        productType={subcategory || "tote-bag"}
                        canvas={canvas}
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

export default function UniversalEditorPage() {
    return (
        <FabricProvider>
            <Suspense fallback={
                <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Initializing Workspace...</p>
                </div>
            }>
                <EditorContent />
            </Suspense>
        </FabricProvider>
    );
}

