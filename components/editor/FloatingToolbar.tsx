"use client";

import { Hand, RotateCcw, RotateCw, Navigation } from "lucide-react";

export default function FloatingToolbar({
    undo,
    redo,
    zoomIn,
    zoomOut,
    zoom
}: {
    undo: () => void;
    redo: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    zoom: number;
}) {
    return (
        <div className="absolute top-6 right-6 flex flex-col bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-1.5 border border-white/50 z-40 gap-1">
            <button className="w-10 h-10 flex items-center justify-center text-pink-500 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all shadow-sm">
                <Navigation size={18} className="fill-current" />
            </button>

            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all">
                <Hand size={18} />
            </button>

            <div className="h-[1px] w-6 bg-gray-100 mx-auto my-1" />

            <button
                onClick={undo}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                title="Undo"
            >
                <RotateCcw size={18} />
            </button>

            <button
                onClick={redo}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                title="Redo"
            >
                <RotateCw size={18} />
            </button>
        </div>
    );
}
