"use client";

import { Undo2, Redo2, Download, Lock, Unlock, MoveUp, MoveDown, ChevronsUp, ChevronsDown, Sparkles, PenTool } from "lucide-react";
import { useFabric } from "@/context/FabricContext";

type Props = {
    download: (format: "png" | "pdf", forceDirect?: boolean) => void;
    onShowMockup: () => void;
};

export default function Toolbar({ download, onShowMockup }: Props) {
    const {
        canvas,
        undo,
        redo,
        toggleLock,
        selectedObject,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        setOpacity,
        mockupMode,
        setMockupMode,
        autoLayout
    } = useFabric();

    const isLocked = selectedObject?.lockMovementX;
    const currentOpacity = selectedObject?.opacity ?? 1;

    return (
        <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-30">
            {/* ... left side content ... */}
            <div className="flex items-center gap-2">
                {/* (rest of left side code kept as is) */}
            </div>

            <div className="flex items-center gap-4">
                {/* Mockup Mode Togglers */}
                <div className="flex bg-gray-100 p-1 rounded-xl items-center border border-gray-200/50">
                    <button
                        onClick={() => { setMockupMode("automated"); autoLayout(); }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${mockupMode === "automated"
                            ? "bg-white text-pink-600 shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <Sparkles size={14} />
                        <span>Automated</span>
                    </button>
                    <button
                        onClick={() => setMockupMode("manual")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${mockupMode === "manual"
                            ? "bg-white text-pink-600 shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <PenTool size={14} />
                        <span>Manual</span>
                    </button>
                </div>

                <div className="w-[1px] h-6 bg-gray-200 mx-1" />

                <button
                    onClick={onShowMockup}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg font-bold text-sm hover:from-pink-700 hover:to-rose-600 transition-all shadow-md hover:shadow-lg active:scale-95 border-none"
                >
                    <span className="text-lg">✨</span>
                    <span>Mockup View</span>
                </button>

                <div className="flex bg-gray-100 p-1 rounded-lg">
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
    );
}
