"use client";

import { Undo2, Redo2, Download, MoveUp, MoveDown, ChevronsUp, ChevronsDown } from "lucide-react";
import { useFabric } from "@/context/FabricContext";

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
        setFillColor,
        saveHistory,
        selectionVersion
    } = useFabric();

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

                        {selectedObject && !["textbox", "image", "IText", "path"].includes(selectedObject.type as string) && (
                            <div className="flex items-center gap-2 ml-2 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200/50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Color</span>
                                <div className="relative w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden group cursor-pointer" style={{ backgroundColor: (selectedObject as any).fill || "#000000" }}>
                                    <input
                                        type="color"
                                        value={(selectedObject as any).fill || "#000000"}
                                        onChange={(e) => setFillColor(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
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
        </div>
    );
}
