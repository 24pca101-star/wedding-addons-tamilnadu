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
import ToteBagUploadPanel from "@/components/editor/ToteBagUploadPanel";
import AIPanel from "@/components/editor/AIPanel";
import LayersPanel from "@/components/editor/LayersPanel";
import { exportAsPNG, exportAsPDF } from "@/utils/export";
import { exportViaPsdService } from "@/utils/psdExport";
import { FabricProvider, useFabric } from "@/context/FabricContext";
import MockupPreview from "@/components/editor/MockupPreview";
import ObjectToolbar from "@/components/editor/ObjectToolbar";

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
        mockupMode,
        setMockupMode
    } = useFabric();

    const [activePanel, setActivePanel] = useState<"text" | "elements" | "uploads" | "shapes" | "ai" | "layers">("text");
    const [showMockup, setShowMockup] = useState(false);

    // In Next.js 15+, useParams() returns a plain object on the client, but we should handle it safely.
    const category = params?.category as string;
    const subcategory = params?.subcategory as string;
    const template = searchParams.get("template");
    const bagType = searchParams.get("bagType");

    const isToteBag = subcategory === 'welcome-tote-bag';

    // Set default panel and mockup state for Tote Bags
    useEffect(() => {
        if (isToteBag) {
            setActivePanel("uploads");
            setShowMockup(true);
        }
    }, [isToteBag]);

    // Standardize dimensions for Tote Bag to ensure it fits the mockup visual perfectly
    const canvasWidth = isToteBag ? 400 : (canvas?.width || psdMetadata?.width || 400);
    const canvasHeight = isToteBag ? 500 : (canvas?.height || psdMetadata?.height || 600);

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
            } else if (c && !isToteBag) {
                // Only add safe area for non-tote bags by default
                // Tote bags should start as 'bag-only' as requested
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

    // sync object selectability based on mockup mode (Tote Bag only)
    useEffect(() => {
        if (!isToteBag || !canvas) return;

        const isAutomated = mockupMode === 'automated';
        const objects = canvas.getObjects();

        objects.forEach(obj => {
            obj.set({
                selectable: !isAutomated,
                evented: !isAutomated,
                hasControls: !isAutomated
            });
        });

        if (isAutomated) {
            canvas.discardActiveObject();
        }
        canvas.requestRenderAll();
    }, [mockupMode, isToteBag, canvas]);

    const handleDownload = async (format: "png" | "pdf", forceDirect: boolean = false) => {
        if (!canvas) return;

        if (!forceDirect && template && template !== "blank") {
            const success = await exportViaPsdService(
                canvas,
                template,
                format === "pdf" ? "pdf" : "png",
                psdMetadata?.width
            );
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
                {activePanel === "uploads" && (isToteBag ? <ToteBagUploadPanel /> : <UploadsPanel />)}
                {activePanel === "ai" && <AIPanel />}
                {activePanel === "layers" && <LayersPanel />}
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <Toolbar
                    download={handleDownload}
                    onShowMockup={() => setShowMockup(true)}
                />

                <div className={`flex-1 relative overflow-hidden flex flex-col ${isToteBag ? 'bg-white' : ''}`}>
                    {!isToteBag ? (
                        <EditorCanvas
                            width={canvasWidth}
                            height={canvasHeight}
                            canvasRef={canvasElementRef}
                            previewUrl={previewUrl}
                            zoom={zoom}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                            {/* Left Side: Interactive 2D Editor */}
                            <div className={`relative transition-all duration-500 ease-in-out bg-gray-50 flex flex-col group/canvas ${mockupMode === 'automated' ? 'w-full' : 'w-full md:w-1/2 border-r border-gray-200 shadow-xl z-10'}`}>
                                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                                        {mockupMode === 'automated' ? 'Direct Studio' : 'Interactive Editor'}
                                    </span>
                                </div>
                                <EditorCanvas
                                    width={canvasWidth}
                                    height={canvasHeight}
                                    canvasRef={canvasElementRef}
                                    previewUrl={previewUrl}
                                    zoom={zoom}
                                    bgImage={`/assets/mockups/${bagType || subcategory || "tote-bag"}/white bag.png`}
                                />
                                {/* On-Object Toolbar */}
                                <ObjectToolbar />
                            </div>

                            {/* Right Side: Real-time 3D Mockup (Only in Manual Mode) */}
                            <div className={`transition-all duration-500 ease-in-out relative bg-[#f8fafc] ${mockupMode === 'manual' ? 'flex-1 translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0 overflow-hidden'}`}>
                                <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-pink-900 uppercase tracking-widest">Live 3D Preview</span>
                                </div>
                                <MockupPreview
                                    active={true}
                                    onClose={() => { }}
                                    psdFilename={template || "design-1.psd"}
                                    productType={bagType || subcategory || "tote-bag"}
                                    canvas={canvas}
                                    isIntegrated={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Quick Adjustment Controls (Floating buttons) */}
                    {isToteBag && (
                        <div className="absolute bottom-6 left-6 flex flex-col bg-white shadow-2xl rounded-2xl p-2 gap-4 border border-gray-100 z-40 animate-in slide-in-from-left duration-500">
                            <button
                                onClick={undo}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-pink-500 rounded-xl transition-all"
                                title="Undo"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 14 4 9l5-5" />
                                    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                                </svg>
                            </button>
                            <button
                                onClick={redo}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-pink-500 rounded-xl transition-all"
                                title="Redo"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 14 5-5-5-5" />
                                    <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
                                </svg>
                            </button>
                        </div>
                    )}


                    <MockupPreview
                        active={showMockup}
                        onClose={() => setShowMockup(false)}
                        psdFilename={template || "design-1.psd"}
                        productType={bagType || subcategory || "tote-bag"}
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

