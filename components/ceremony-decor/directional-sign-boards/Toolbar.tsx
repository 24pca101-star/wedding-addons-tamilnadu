'use client';

import React from 'react';

interface ToolbarProps {
    selectedSize: string;
    onSave: () => void;
    onBack: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleGrid: () => void;
    onTogglePreview: () => void;
    onDelete: () => void;
    canUndo: boolean;
    canRedo: boolean;
    zoom: number;
    gridActive: boolean;
    isPreview: boolean;
    hasSelectedObject: boolean;
}

export default function Toolbar({
    selectedSize,
    onSave,
    onBack,
    onUndo,
    onRedo,
    onZoomIn,
    onZoomOut,
    onToggleGrid,
    onTogglePreview,
    onDelete,
    canUndo,
    canRedo,
    zoom,
    gridActive,
    isPreview,
    hasSelectedObject
}: ToolbarProps) {
    return (
        <div className="h-20 bg-[#FFFDF9] border-b-2 border-[#D4AF37]/30 px-6 flex items-center justify-between shadow-xl z-[100] relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="bg-white border-2 border-[#800000] text-[#800000] px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#800000] hover:text-white transition-all shadow-md active:translate-y-1"
                >
                    ← EXIT
                </button>
                <div className="flex flex-col border-l-2 border-[#D4AF37]/20 pl-4">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Format</span>
                    <span className="text-sm font-serif text-[#800000] font-black uppercase tracking-tighter">{selectedSize}</span>
                </div>
            </div>

            {/* Editor Controls - Compact & Clear */}
            {!isPreview && (
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-[#D4AF37]/20 shadow-lg">
                    <div className="flex items-center gap-1 border-r-2 border-gray-100 pr-3">
                        <button
                            onClick={onUndo}
                            disabled={!canUndo}
                            className={`px-3 h-10 flex items-center gap-2 justify-center rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${canUndo ? 'bg-[#F9F6F0] text-[#800000] shadow-sm hover:bg-[#D4AF37] hover:text-white' : 'text-gray-200 cursor-not-allowed bg-gray-50'}`}
                            title="Undo"
                        >
                            <span>UNDO</span>
                        </button>
                        <button
                            onClick={onRedo}
                            disabled={!canRedo}
                            className={`px-3 h-10 flex items-center gap-2 justify-center rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${canRedo ? 'bg-[#F9F6F0] text-[#800000] shadow-sm hover:bg-[#D4AF37] hover:text-white' : 'text-gray-200 cursor-not-allowed bg-gray-50'}`}
                            title="Redo"
                        >
                            <span>REDO</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-[#F9F6F0] px-3 py-1 rounded-xl">
                        <button onClick={onZoomOut} className="text-[#800000] font-black text-xl hover:scale-125 transition-transform">➖</button>
                        <span className="text-xs font-black text-[#800000] w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={onZoomIn} className="text-[#800000] font-black text-xl hover:scale-125 transition-transform">➕</button>
                    </div>

                    <button
                        onClick={onToggleGrid}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all border-2 ${gridActive ? 'bg-[#800000] border-[#800000] text-white shadow-inner' : 'bg-white border-gray-100 text-[#800000] hover:border-[#D4AF37]'}`}
                    >
                        #️⃣
                    </button>
                </div>
            )}

            <div className="flex items-center gap-4">
                <button
                    onClick={onTogglePreview}
                    className={`px-6 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${isPreview ? 'bg-[#800000] text-white border-[#800000] shadow-lg' : 'bg-white text-[#800000] border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 shadow-sm'}`}
                >
                    {isPreview ? '✏️ EDIT BOARD' : '👁️ PREVIEW'}
                </button>

                {hasSelectedObject && !isPreview && (
                    <button
                        onClick={onDelete}
                        style={{ backgroundColor: '#FFF0F0', color: '#B91C1C', border: '2px solid #FEE2E2' }}
                        className="px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span>🗑️</span>
                        <span>DELETE</span>
                    </button>
                )}

                {/* DOWNLOAD BUTTON - MAXIMUM VISIBILITY */}
                <button
                    onClick={onSave}
                    style={{ backgroundColor: '#800000', color: '#FFFFFF', border: '2px solid #D4AF37' }}
                    className="px-6 py-2.5 rounded-xl font-serif font-black shadow-[0_5px_15px_rgba(128,0,0,0.3)] hover:shadow-[0_10px_25px_rgba(128,0,0,0.4)] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 group"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">📥</span>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[8px] uppercase tracking-[0.2em] opacity-80 mb-0.5">Finish Design</span>
                        <span className="text-base tracking-tight">DOWNLOAD PDF</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
