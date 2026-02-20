'use client';

import React, { useState } from 'react';
import { MONTHS, YEARS, CALENDAR_MOTIFS } from '@/lib/calendar-presets';
import { BACKGROUND_PRESETS } from '@/lib/customizer-presets';

interface SidebarProps {
    onAddText: () => void;
    onAddCalendar: (month: number, year: number) => void;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onColorChange: (color: string) => void;
    onTextureChange: (textureUrl: string) => void;
    onApplyEffect: (effectId: string) => void;
    onDelete: () => void;
    onLock: () => void;
    onFontSizeChange: (size: number) => void;
    onFontChange: (font: string) => void;
    onAlignChange: (align: 'left' | 'center' | 'right') => void;
    onObjectColorChange: (color: string) => void;
    onAddMotif: (motif: any) => void;
    selectedObject: any;
    objects: any[];
    onSelectObject: (obj: any) => void;
    foldedMode?: boolean;
    currentSide?: 'front' | 'inside';
    onToggleSide?: () => void;
}

export default function Sidebar({
    onAddText,
    onAddCalendar,
    onUploadImage,
    onColorChange,
    onTextureChange,
    onApplyEffect,
    onDelete,
    onLock,
    onFontSizeChange,
    onFontChange,
    onAlignChange,
    onObjectColorChange,
    onAddMotif,
    selectedObject,
    objects = [],
    onSelectObject,
    foldedMode,
    currentSide,
    onToggleSide
}: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'calendar' | 'elements' | 'layers'>('templates');
    const [selMonth, setSelMonth] = useState(new Date().getMonth());
    const [selYear, setSelYear] = useState(new Date().getFullYear());

    const tabs = [
        { id: 'templates' as const, label: 'Layouts', icon: '📋' },
        { id: 'text' as const, label: 'Text', icon: 'T' },
        { id: 'calendar' as const, label: 'Date', icon: '📅' },
        { id: 'elements' as const, label: 'Add', icon: '✨' },
        { id: 'layers' as const, label: 'Layers', icon: '📁' },
    ];

    return (
        <div className="w-80 bg-[#FCFAf7] border-r border-gold/20 h-full flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.03)] z-30">
            {/* Folded Mode Side Toggle */}
            {foldedMode && (
                <div className="p-4 bg-maroon/5 border-b border-gold/10 flex gap-2">
                    <button
                        onClick={onToggleSide}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentSide === 'front' ? 'bg-maroon text-white' : 'bg-white text-maroon border border-gold/20'}`}
                    >
                        Front Side
                    </button>
                    <button
                        onClick={onToggleSide}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentSide === 'inside' ? 'bg-maroon text-white' : 'bg-white text-maroon border border-gold/20'}`}
                    >
                        Inside Side
                    </button>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex bg-[#F8F5F2] border-b border-gold/20 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[64px] flex flex-col items-center justify-center py-4 transition-all relative group h-16 ${isActive
                                ? 'bg-white text-maroon shadow-sm'
                                : 'text-gray-400 hover:text-gold hover:bg-white/50'
                                }`}
                        >
                            <span className={`text-lg mb-0.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-60'}`}>{tab.icon}</span>
                            <span className={`text-[8.5px] font-black uppercase tracking-tighter text-center leading-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-maroon animate-innerWidth" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                {activeTab === 'templates' && (
                    <div className="animate-fadeIn space-y-6">
                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Quick Add</h4>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={onAddText}
                                    className="w-full py-4 bg-maroon text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#600000] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md shadow-maroon/20"
                                >
                                    <span>➕</span> ADD TEXT BOX
                                </button>
                                <label className="block">
                                    <input type="file" onChange={onUploadImage} accept="image/*" className="hidden" />
                                    <div className="w-full py-4 bg-white border-2 border-dashed border-gold/30 text-gold rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-gold hover:bg-gold/5 transition-all flex items-center justify-center gap-3 cursor-pointer">
                                        <span>🖼️</span> UPLOAD PHOTO
                                    </div>
                                </label>
                            </div>
                        </section>

                        <section className="pt-6">
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Background Color</h4>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {BACKGROUND_PRESETS.solids.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => onColorChange(color)}
                                        className="aspect-square rounded-full border border-gold/10 hover:scale-125 transition-transform shadow-sm"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="bg-cream/20 p-5 rounded-2xl border border-gold/20 space-y-6">
                            <div className="flex flex-col gap-4">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em] text-center">Month Generator</h4>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <select
                                            value={selMonth}
                                            onChange={(e) => setSelMonth(parseInt(e.target.value))}
                                            className="w-full p-4 bg-white border border-gold/20 rounded-xl text-xs font-serif outline-none appearance-none cursor-pointer"
                                        >
                                            <option value={-1}>📅 Full Year (12 Months)</option>
                                            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold">▼</div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={selYear}
                                            onChange={(e) => setSelYear(parseInt(e.target.value))}
                                            className="w-full p-4 bg-white border border-gold/20 rounded-xl text-xs font-serif outline-none appearance-none cursor-pointer"
                                        >
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold">▼</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onAddCalendar(selMonth, selYear)}
                                className="w-full py-4 bg-gold text-maroon rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#B38B2D] hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md border-b-4 border-gold/60"
                            >
                                <span>📅</span> GENERATE GRID
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-tighter leading-relaxed italic">
                            The grid will automatically align based on <br /> the selected month and year.
                        </p>
                    </div>
                )}

                {activeTab === 'text' && (
                    <div className="animate-fadeIn space-y-6">
                        {selectedObject?.type === 'i-text' || selectedObject?.type === 'group' ? (
                            <div className="space-y-6 bg-white p-6 rounded-2xl border border-gold/10 shadow-sm">
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Font Selection</label>
                                    <select
                                        value={selectedObject.fontFamily}
                                        onChange={(e) => onFontChange(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gold/10 rounded-xl text-xs font-serif appearance-none cursor-pointer outline-none focus:border-gold"
                                    >
                                        <option value="Playfair Display">Luxury Serif</option>
                                        <option value="Outfit">Modern Clean</option>
                                        <option value="serif">System Serif</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Size</label>
                                        <input
                                            type="number"
                                            value={selectedObject.fontSize}
                                            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                                            className="w-full p-4 bg-gray-50 border border-gold/10 rounded-xl text-xs font-bold outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Color</label>
                                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gold/10 rounded-xl">
                                            {['#800000', '#D4AF37', '#000000'].map(c => (
                                                <button key={c} onClick={() => onObjectColorChange(c)} className="w-5 h-5 rounded-full border border-gold/10" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button onClick={onDelete} className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    Remove Element
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-cream/5 rounded-[2rem] border-2 border-dashed border-gold/10">
                                <span className="text-gray-400 text-xs font-medium">Select text to edit</span>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'elements' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {CALENDAR_MOTIFS.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => onAddMotif(m)}
                                    className="aspect-square bg-white border border-gold/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gold hover:shadow-lg transition-all active:scale-90 group"
                                >
                                    <span className="text-2xl group-hover:scale-125 transition-transform">{m.emoji}</span>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{m.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'layers' && (
                    <div className="animate-fadeIn space-y-4">
                        <div className="flex flex-col gap-3">
                            {objects.length === 0 ? (
                                <p className="text-center py-20 text-[10px] text-gray-400 font-black uppercase">No layers yet</p>
                            ) : (
                                [...objects].reverse().map((obj) => (
                                    <div
                                        key={obj.id}
                                        onClick={() => onSelectObject(obj.ref)}
                                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${obj.isActive ? 'bg-maroon text-white border-maroon shadow-md' : 'bg-white border-gold/5 text-maroon hover:border-gold/30'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="opacity-60">{obj.type === 'i-text' ? 'T' : (obj.type === 'group' ? '📅' : '🖼️')}</span>
                                            <span className="text-[10px] font-black uppercase truncate max-w-[120px] tracking-tighter">{obj.text || obj.type}</span>
                                        </div>
                                        {obj.locked && <span className="text-xs">🔒</span>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
