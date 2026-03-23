"use client";

import { Undo2, Redo2, Download, MoveUp, MoveDown, ChevronsUp, ChevronsDown, Cuboid } from "lucide-react";
import { useFabric } from "@/context/FabricContext";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getMockupConfig } from "@/lib/mockup-config";
import Mockup3D from "./Mockup3D";

type Props = {
    download: (format: "png" | "pdf", forceDirect?: boolean) => void;
};

export default function Toolbar({ download }: Props) {
    const {
        canvas,
        undo,
        redo,
        canUndo,
        canRedo,
        selectedObject,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        setOpacity,
        saveHistory,
        selectionVersion
    } = useFabric();

    const params = useParams();
    const subcategory = params?.subcategory as string;
    const mockupConfig = getMockupConfig(subcategory);

    const [showMockup3D, setShowMockup3D] = useState(false);
    const [mockupTexture, setMockupTexture] = useState<string | null>(null);

    const handleOpenMockup = () => {
        if (!canvas) return;
        
        // Deselect objects to get a clean export
        canvas.discardActiveObject();
        canvas.requestRenderAll();

        // Export canvas as high-quality data URL
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // Higher resolution for 3D texture
        });
        
        setMockupTexture(dataURL);
        setShowMockup3D(true);
    };

    const currentOpacity = selectedObject?.opacity ?? 1;

    return (
        <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-30">
            {/* Left side: Undo/Redo & Layer Controls */}
            <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
                    <button
                        onClick={() => undo()}
                        disabled={!canUndo}
                        className={`p-1.5 rounded-lg transition-all ${canUndo ? "text-gray-500 hover:text-pink-600 hover:bg-white hover:shadow-sm" : "text-gray-300 cursor-not-allowed"}`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={18} />
                    </button>
                    <button
                        onClick={() => redo()}
                        disabled={!canRedo}
                        className={`p-1.5 rounded-lg transition-all ${canRedo ? "text-gray-500 hover:text-pink-600 hover:bg-white hover:shadow-sm" : "text-gray-300 cursor-not-allowed"}`}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>

                {selectedObject && (
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button onClick={() => bringToFront()} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-pink-600 hover:shadow-sm" title="Bring to Front">
                                <ChevronsUp size={18} />
                            </button>
                            <button onClick={() => bringForward()} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-pink-600 hover:shadow-sm" title="Bring Forward">
                                <MoveUp size={18} />
                            </button>
                            <button onClick={() => sendBackward()} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-pink-600 hover:shadow-sm" title="Send Backward">
                                <MoveDown size={18} />
                            </button>
                            <button onClick={() => sendToBack()} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-pink-600 shadow-sm" title="Send to Back">
                                <ChevronsDown size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 ml-2 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200/50">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opacity</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={currentOpacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                onMouseUp={() => saveHistory()}
                                className="w-20 accent-pink-500"
                            />
                            <span className="text-[10px] font-bold text-gray-600 min-w-[25px]">
                                {Math.round(currentOpacity * 100)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {mockupConfig && (
                            <button
                                onClick={handleOpenMockup}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold bg-white text-pink-600 shadow-sm transition-all hover:bg-pink-50 active:scale-95 border border-pink-100/50"
                                title="View 3D Mockup"
                            >
                                <Cuboid size={16} />
                                <span>3D Preview</span>
                            </button>
                        )}
                        <button
                            onClick={() => download("png", true)}
                            className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all hover:bg-white hover:shadow-sm"
                            title="Download as PNG (Instant)"
                        >
                            PNG
                        </button>
                        <button
                            onClick={() => download("pdf", true)}
                            className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all hover:bg-white hover:shadow-sm"
                            title="Download as PDF (Instant)"
                        >
                            PDF
                        </button>
                    </div>

                    <button
                        onClick={() => download("png")}
                        className="bg-pink-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-pink-700 transition-all shadow-md flex items-center gap-2 active:scale-95"
                        title="Export High-Quality (PSD Based)"
                    >
                        <Download size={18} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Global 3D Mockup Modal */}
            {showMockup3D && mockupConfig && mockupTexture && (
                <Mockup3D 
                    config={mockupConfig}
                    textureUrl={mockupTexture}
                    onClose={() => setShowMockup3D(false)}
                />
            )}
        </div>
    );
}
