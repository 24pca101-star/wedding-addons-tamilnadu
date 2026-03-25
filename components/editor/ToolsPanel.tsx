"use client";

import { useState } from "react";
import { 
    MousePointer2, Pencil, Square, Circle, Minus, 
    Triangle, Hexagon, Star, Diamond, ChevronLeft, LayoutPanelLeft 
} from "lucide-react";
import { useFabric } from "@/context/FabricContext";

type ViewType = "main" | "shapes" | "draw";

export default function ToolsPanel() {
    const { 
        addShape, toggleDrawingMode, isDrawingMode,
        brushColor, brushWidth, isEraserMode,
        setBrushColor, setBrushWidth, setEraserMode
    } = useFabric();
    const [view, setView] = useState<ViewType>("main");

    const shapes = [
        { id: "rect", icon: Square, label: "Square" },
        { id: "circle", icon: Circle, label: "Circle" },
        { id: "triangle", icon: Triangle, label: "Triangle" },
        { id: "hexagon", icon: Hexagon, label: "Hexagon" },
        { id: "star", icon: Star, label: "Star" },
        { id: "diamond", icon: Diamond, label: "Diamond" },
        { id: "line", icon: Minus, label: "Line", rotate: "-rotate-45" },
    ];

    const pens = [
        { id: 'blue', color: '#3B82F6', label: 'Blue' },
        { id: 'red', color: '#EF4444', label: 'Red' },
        { id: 'yellow', color: '#FACC15', label: 'Yellow' },
    ];

    if (view === "shapes") {
        return (
            <div className="p-5 flex flex-col gap-6 h-full bg-white select-none">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setView("main")}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 font-sans tracking-tight caps">Shapes</h3>
                        <p className="text-xs text-gray-400 font-medium">Add geometric elements</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {shapes.map((shape) => (
                        <button
                            key={shape.id}
                            onClick={() => {
                                toggleDrawingMode(false);
                                addShape(shape.id);
                            }}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-400 hover:border-pink-200 hover:bg-white transition-all gap-2 group"
                        >
                            <shape.icon size={24} className={`group-hover:scale-110 transition-transform ${shape.rotate || ""}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{shape.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (view === "draw") {
        return (
            <div className="p-5 flex flex-col gap-6 h-full bg-white select-none">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setView("main")}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 font-sans tracking-tight caps">Draw Options</h3>
                        <p className="text-xs text-gray-400 font-medium">Choose your pen & styles</p>
                    </div>
                </div>

                <div className="flex flex-col gap-8 py-4">
                    {/* Pens Section */}
                    <div className="flex flex-col gap-4">
                        {pens.map((pen) => (
                            <button
                                key={pen.id}
                                onClick={() => {
                                    setBrushColor(pen.color);
                                    setEraserMode(false);
                                }}
                                className={`relative group flex items-center p-2 rounded-2xl transition-all ${
                                    brushColor === pen.color && !isEraserMode 
                                    ? "bg-gray-100 ring-2 ring-pink-500 shadow-md scale-[1.02]" 
                                    : "hover:bg-gray-50 opacity-60 hover:opacity-100"
                                }`}
                            >
                                {/* Pen Body Mimic */}
                                <div className="flex items-center w-full">
                                    <div className={`w-32 h-8 rounded-l-lg border-y-2 border-l-2 border-gray-200 flex items-center justify-end pr-2 overflow-hidden bg-white shadow-inner`}>
                                        <div className="w-full h-full opacity-10" style={{ backgroundColor: pen.color }} />
                                        <div className="absolute left-6 w-1 h-full" style={{ backgroundColor: pen.color }} />
                                    </div>
                                    <div 
                                        className="w-8 h-8 rounded-r-full shadow-md transform translate-x-[-4px] z-10 border-2 border-white"
                                        style={{ backgroundColor: pen.color }}
                                    />
                                </div>
                                <span className={`ml-4 text-[10px] font-black uppercase tracking-widest ${brushColor === pen.color && !isEraserMode ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {pen.label}
                                </span>
                            </button>
                        ))}

                        {/* Eraser */}
                        <button
                            onClick={() => setEraserMode(true)}
                            className={`relative group flex items-center p-2 rounded-2xl transition-all ${
                                isEraserMode 
                                ? "bg-gray-100 ring-2 ring-pink-500 shadow-md scale-[1.02]" 
                                : "hover:bg-gray-50 opacity-60 hover:opacity-100"
                            }`}
                        >
                            <div className="flex items-center w-full">
                                <div className="w-32 h-10 bg-pink-400 rounded-lg border-2 border-pink-500 shadow-md flex items-center pr-3">
                                    <div className="w-6 h-full bg-pink-500/20 ml-auto border-l border-white/30" />
                                </div>
                            </div>
                            <span className={`ml-4 text-[10px] font-black uppercase tracking-widest ${isEraserMode ? 'text-pink-600' : 'text-gray-400'}`}>
                                Eraser
                            </span>
                        </button>
                    </div>

                    <div className="h-px bg-gray-100 mx-2" />

                    {/* Style Settings */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Brush Size</label>
                            <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                                {[2, 5, 10, 20].map((w) => (
                                    <button
                                        key={w}
                                        onClick={() => setBrushWidth(w)}
                                        className={`h-10 rounded-xl transition-all flex items-center px-4 gap-4 ${
                                            brushWidth === w ? "bg-white shadow-sm border-gray-200" : "hover:bg-white/50"
                                        }`}
                                    >
                                        <div className="bg-gray-900 rounded-full" style={{ height: `${Math.max(1, w/2)}px`, width: '100%' }} />
                                        <span className="text-[10px] font-bold text-gray-500 w-8">{w}px</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Color</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <div 
                                    className="w-10 h-10 rounded-full shadow-lg border-2 border-white ring-2 ring-gray-100"
                                    style={{ backgroundColor: isEraserMode ? '#ffffff' : brushColor }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                                        {isEraserMode ? 'Eraser Active' : pens.find(p => p.color === brushColor)?.label || 'Custom'}
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400 tracking-wider">
                                        {isEraserMode ? 'Transparent Mode' : brushColor.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 flex flex-col gap-6 h-full bg-white select-none">
            <div>
                <h3 className="text-lg font-black text-gray-900 font-sans tracking-tight caps">Editor Tools</h3>
                <p className="text-xs text-gray-400 font-medium">Select a tool to modify your design</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Selection Tool */}
                <button
                    onClick={() => toggleDrawingMode(false)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 group ${
                        !isDrawingMode 
                        ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md shadow-pink-100" 
                        : "border-gray-100 bg-gray-50 text-gray-400 hover:border-pink-200 hover:bg-white"
                    }`}
                >
                    <MousePointer2 size={24} className={!isDrawingMode ? "scale-110 transition-transform" : "group-hover:scale-110 transition-transform"} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cursor</span>
                </button>

                {/* Drawing Tool */}
                <button
                    onClick={() => {
                        toggleDrawingMode(true);
                        setView("draw");
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 group ${
                        isDrawingMode 
                        ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md shadow-pink-100" 
                        : "border-gray-100 bg-gray-50 text-gray-400 hover:border-pink-200 hover:bg-white"
                    }`}
                >
                    <Pencil size={24} className={isDrawingMode ? "scale-110 transition-transform" : "group-hover:scale-110 transition-transform"} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Draw</span>
                </button>

                {/* Shapes Category Tool */}
                <button
                    onClick={() => setView("shapes")}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-400 hover:border-pink-200 hover:bg-white transition-all gap-2 group col-span-2 py-6"
                >
                    <LayoutPanelLeft size={32} className="group-hover:scale-110 transition-transform text-pink-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Explore Shapes</span>
                    <span className="text-[9px] text-gray-400 font-medium italic">Rectangle, Circle, Star & more</span>
                </button>
            </div>

            <div className="mt-auto p-4 bg-pink-50 rounded-2xl border border-pink-100">
                <p className="text-[10px] font-bold text-pink-600 uppercase mb-1">Design Tip</p>
                <p className="text-[11px] text-pink-700 leading-relaxed">
                    Combine <b>Shapes</b> to create unique patterns and frames for your wedding graphics.
                </p>
            </div>
        </div>
    );
}
