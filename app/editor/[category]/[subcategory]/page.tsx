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
import WeddingTemplatesPanel from "@/components/editor/WeddingTemplatesPanel";
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
        centerObjectH,
        centerObjectV,
        mockupMode,
        setMockupMode,
        setBackgroundImage,
        isPreview,
        setIsPreview,
        duplicateObject,
        addShape,
        addImage,
        setTextSize,
        setTextColor,
        setTextAlign,
        toggleVisibility
    } = useFabric();

    const [activePanel, setActivePanel] = useState<"text" | "elements" | "uploads" | "shapes" | "ai" | "layers">("text");
    const [showMockup, setShowMockup] = useState(false);

    // In Next.js 15+, useParams() returns a plain object on the client, but we should handle it safely.
    const category = params?.category as string;
    const subcategory = params?.subcategory as string;
    const template = searchParams.get("template");
    const bagType = searchParams.get("bagType") || (subcategory === 'directional-sign-boards' ? 'easel-arch' : null);

    const isToteBag = subcategory === 'welcome-tote-bag';
    const isDirectionalBoard = subcategory === 'directional-sign-boards';
    const isHandFan = subcategory === 'printed-visiri-hand-fan';
    const isCustomMockup = isToteBag || isDirectionalBoard || isHandFan;

    // Set default panel and mockup state for Custom Mockups
    useEffect(() => {
        if (isCustomMockup) {
            setActivePanel("uploads");
            // Only show the 3D mockup overlay by default for Tote Bags
            if (isToteBag) {
                setShowMockup(true);
            }
            // Directional boards & Hand Fans should start in manual mode
            if (isDirectionalBoard || isHandFan) {
                setMockupMode("manual");
            }
        }
    }, [isCustomMockup, isToteBag, isDirectionalBoard, isHandFan, setMockupMode]);

    // Handle background image for Custom Mockups
    useEffect(() => {
        if (canvas && isCustomMockup) {
            let boardPath = "";
            let generatedPreviewPath = template && template !== "blank" 
                ? `http://localhost:5005/preview/${template.replace('.psd', '.png')}` 
                : "";
            
            if (isDirectionalBoard && bagType) {
                boardPath = isPreview 
                    ? `/assets/mockups/directional-boards/${bagType}.png`
                    : `/assets/mockups/directional-boards/${bagType}-no-bg.png`;
            } else if (isToteBag) {
                // Map subcategory to asset folder 'tote-bags' and use selected bagType or default
                const internalBagType = bagType || "totebag1";
                boardPath = `/assets/mockups/tote-bags/${internalBagType}.png`;
            } else if (isHandFan) {
                // Map subcategory to asset folder 'hand-fans'
                const internalFanType = bagType || "handfan1";
                boardPath = `/assets/mockups/hand-fans/${internalFanType}.png`; 
            }

            const setCustomBackground = async (path: string) => {
                try {
                    // Check if image exists before setting it
                    const img = new Image();
                    img.onload = () => setBackgroundImage(path);
                    img.onerror = () => {
                        console.warn(`⚠️ Mockup image not found: ${path}. Falling back to generated preview or blank.`);
                        if (generatedPreviewPath) {
                            setBackgroundImage(generatedPreviewPath);
                        } else {
                            setBackgroundImage("/assets/blank-canvas.png");
                        }
                    };
                    img.src = path;
                } catch (e) {
                    setBackgroundImage("/assets/blank-canvas.png");
                }
            };

            if (boardPath) {
                setCustomBackground(boardPath);
            } else if (generatedPreviewPath) {
                setBackgroundImage(generatedPreviewPath);
            }

            // Disable interaction in preview mode
            canvas.getObjects().forEach(obj => {
                obj.set({
                    selectable: !isPreview,
                    evented: !isPreview,
                    hasControls: !isPreview
                });
            });
            if (isPreview) canvas.discardActiveObject();
            canvas.requestRenderAll();
        }
    }, [isCustomMockup, isDirectionalBoard, isToteBag, isHandFan, canvas, bagType, template, setBackgroundImage, isPreview]);

    // Standardize dimensions for Custom Mockups
    const canvasWidth = isToteBag ? 400 : (isDirectionalBoard ? 600 : (isHandFan ? 500 : (canvas?.width || psdMetadata?.width || 400)));
    const canvasHeight = isToteBag ? 500 : (isDirectionalBoard ? 600 : (isHandFan ? 500 : (canvas?.height || psdMetadata?.height || 600)));

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
            } else if (c && !isCustomMockup) {
                // Only add safe area for non-custom mockups by default
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
                } else if (e.key === "d") {
                    e.preventDefault();
                    duplicateObject();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canvas, deleteSelected, undo, redo]);

    // sync object selectability based on mockup mode (Custom Mockups only)
    useEffect(() => {
        if (!isCustomMockup || !canvas) return;

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
            <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} isDirectionalBoard={isDirectionalBoard} />

            <div className="w-80 bg-white border-r overflow-y-auto overflow-x-hidden shadow-sm z-10">
                {activePanel === "text" && <TextPanel />}
                {activePanel === "elements" && <ElementsPanel />}
                {activePanel === "shapes" && <ShapesPanel />}
                {activePanel === "uploads" && (
                    (isDirectionalBoard || isHandFan) ? <WeddingTemplatesPanel /> : (isToteBag ? <ToteBagUploadPanel /> : <UploadsPanel />)
                )}
                {activePanel === "ai" && <AIPanel />}
                {activePanel === "layers" && <LayersPanel />}
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <Toolbar
                    download={handleDownload}
                    onShowMockup={() => setShowMockup(true)}
                    isDirectionalBoard={isDirectionalBoard}
                />

                <div className={`flex-1 relative overflow-hidden flex flex-col ${isCustomMockup ? 'bg-white' : ''}`}>
                    {(!isCustomMockup || isDirectionalBoard || isHandFan) ? (
                        <EditorCanvas
                            width={canvasWidth}
                            height={canvasHeight}
                            canvasRef={canvasElementRef}
                            previewUrl={previewUrl}
                            zoom={zoom}
                            isDirectionalBoard={isDirectionalBoard}
                        />
                    ) : (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Side: 2D Canvas Editor */}
                            <div className="flex-1 border-r border-gray-100 relative bg-[#f8f9fa] flex flex-row min-w-0">
                                {/* Interactive 2D Editor */}
                                <EditorCanvas
                                    width={canvasWidth}
                                    height={canvasHeight}
                                    canvasRef={canvasElementRef}
                                    previewUrl={previewUrl}
                                    zoom={zoom}
                                    bgImage={`/assets/mockups/${bagType || subcategory || "tote-bag"}/white bag.png`}
                                />
                                {/* On-Object Toolbar */}
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

                    {/* Preview Indicator Overlay */}
                    {isPreview && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-pink-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-pink-500/40 z-50 animate-bounce pointer-events-none">
                            Preview Mode Active
                        </div>
                    )}

                    {/* On-Object Toolbar (Floating Delete/Duplicate menu) */}
                    <ObjectToolbar />

                    {/* Quick Adjustment Controls (Floating buttons) */}
                    {isCustomMockup && (
                        <div className="absolute bottom-6 left-6 flex flex-col bg-white shadow-2xl rounded-2xl p-2 gap-4 border border-gray-100 z-40 animate-in slide-in-from-left duration-500">
                            <button
                                onClick={() => setIsPreview(!isPreview)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isPreview ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'text-gray-400 hover:bg-gray-50 hover:text-pink-500'}`}
                                title={isPreview ? "Exit Preview" : "Preview on Board"}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                            <div className="h-px bg-gray-100 mx-2" />
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

