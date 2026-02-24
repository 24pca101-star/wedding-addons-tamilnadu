'use client';

import React, { useState } from 'react';
import { BACKGROUND_PRESETS, TEMPLATES, MOTIFS } from '@/lib/customizer-presets';

interface SidebarProps {
    onAddText: () => void;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadPsd: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddArrow: (direction: 'left' | 'right' | 'up' | 'down') => void;
    onLoadTemplate: (templateId: string) => void;
    onColorChange: (color: string) => void;
    onGradientChange: (c1: string, c2: string) => void;
    onDelete: () => void;
    onBringForward: () => void;
    onSendBackward: () => void;
    onDuplicate: () => void;
    onLock: () => void;
    onFontSizeChange: (size: number) => void;
    onFontChange: (font: string) => void;
    onAlignChange: (align: 'left' | 'center' | 'right') => void;
    onLetterSpacing: (spacing: number) => void;
    onLineHeight: (height: number) => void;
    onTextShadow: (active: boolean) => void;
    onAlignBoard: (type: 'left' | 'center' | 'right' | 'top' | 'bottom') => void;
    onAddMotif: (motif: any) => void;
    onAddShape: (type: 'rect' | 'circle' | 'triangle') => void;
    onClipImage: (type: 'round' | 'rect') => void;
    onObjectColorChange: (color: string) => void;
    onApplyEffect: (effectId: string) => void;
    onTextureChange: (textureUrl: string) => void;
    selectedObject: any;
    objects: any[];
    onSelectObject: (obj: any) => void;
}

export default function Sidebar({
    onAddText,
    onUploadImage,
    onUploadPsd,
    onAddArrow,
    onLoadTemplate,
    onColorChange,
    onGradientChange,
    onDelete,
    onBringForward,
    onSendBackward,
    onDuplicate,
    onLock,
    onFontSizeChange,
    onFontChange,
    onAlignChange,
    onLetterSpacing,
    onLineHeight,
    onTextShadow,
    onAlignBoard,
    onAddMotif,
    onAddShape,
    onClipImage,
    onObjectColorChange,
    onApplyEffect,
    onTextureChange,
    selectedObject,
    objects = [],
    onSelectObject
}: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'bg' | 'elements' | 'layers'>('templates');

    const tabs = [
        { id: 'templates' as const, label: 'Templates', icon: '📋' },
        { id: 'text' as const, label: 'Text', icon: 'T' },
        { id: 'bg' as const, label: 'BG', icon: '🎨' },
        { id: 'elements' as const, label: 'Add', icon: '✨' },
        { id: 'layers' as const, label: 'Layers', icon: '📁' },
    ];

    return (
        <div className="w-80 bg-[#FCFAf7] border-r border-gold/20 h-full flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.03)] z-20">
            {/* Tab Navigation - Enhanced visibility and space-efficiency */}
            <div className="flex bg-[#F8F5F2] border-b border-gold/20 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[64px] flex flex-col items-center justify-center py-3.5 px-0.5 transition-all relative group h-16 ${isActive
                                ? 'bg-white text-maroon shadow-[0_-4px_12px_rgba(128,0,0,0.05)]'
                                : 'text-gray-400 hover:text-gold hover:bg-white/50'
                                }`}
                        >
                            <span className={`text-lg mb-0.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}`}>{tab.icon}</span>
                            <span className={`text-[8.5px] font-black uppercase tracking-tighter text-center leading-tight whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-60'}`}>
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
                        <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1">
                            <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Ready Layouts</h4>
                        </div>
                        <div className="space-y-4">
                            {TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => onLoadTemplate(tpl.id)}
                                    className="w-full p-5 border border-gold/20 rounded-2xl hover:border-gold hover:bg-gold/5 transition-all text-left group bg-white shadow-sm hover:shadow-md border-b-4 active:border-b-0 active:translate-y-1"
                                >
                                    <div className="font-serif text-maroon font-bold text-lg mb-1">{tpl.name}</div>
                                    <div className="text-[10px] text-gold font-bold uppercase tracking-widest block mb-3">{tpl.nameTamil}</div>
                                    <div className="text-[11px] text-gray-500 leading-relaxed italic border-t border-gold/5 pt-2">{tpl.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Persistent Global Actions */}
                <div className="p-4 bg-gray-50/80 border-b border-gold/10 space-y-3">
                    <button
                        onClick={onAddText}
                        style={{ backgroundColor: '#800000', color: 'white', borderBottom: '4px solid rgba(0,0,0,0.2)' }}
                        className="w-full py-4 font-serif font-black text-sm rounded-xl shadow-lg hover:bg-[#600000] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span className="text-xl">➕</span>
                        <span className="tracking-widest">ADD TEXT BOX</span>
                    </button>

                    <div className="flex gap-2">
                        <label className="flex-1">
                            <input type="file" onChange={onUploadImage} accept="image/*" className="hidden" />
                            <div className="w-full py-2.5 bg-white border-2 border-gold/20 text-maroon font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm hover:bg-gold/5 cursor-pointer transition-all flex items-center justify-center gap-2 active:translate-y-0.5">
                                <span>🖼️</span>
                                <span>IMAGE</span>
                            </div>
                        </label>
                        <label className="flex-1">
                            <input type="file" onChange={onUploadPsd} accept=".psd" className="hidden" />
                            <div className="w-full py-2.5 bg-white border-2 border-dashed border-maroon/30 text-maroon font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm hover:bg-maroon/5 cursor-pointer transition-all flex items-center justify-center gap-2 active:translate-y-0.5">
                                <span>🎨</span>
                                <span>PSD</span>
                            </div>
                        </label>
                        <button
                            onClick={onDelete}
                            disabled={!selectedObject}
                            style={{ backgroundColor: selectedObject ? '#FFF0F0' : '#F9F9F9', color: selectedObject ? '#B91C1C' : '#CCC' }}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${selectedObject ? 'border-red-100 shadow-sm hover:bg-red-600 hover:text-white' : 'border-gray-100 cursor-not-allowed'} transition-all flex items-center justify-center gap-2 active:scale-95`}
                        >
                            <span>🗑️</span>
                        </button>
                    </div>
                </div>

                {/* Tab Navigation - Enhanced visibility */}
                ...
                {activeTab === 'text' && (
                    <div className="animate-fadeIn space-y-6">
                        {selectedObject?.type === 'i-text' ? (
                            <div className="space-y-6 p-5 bg-[#F9F6F0] rounded-2xl border border-gold/20 shadow-sm animate-slideDown">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Typography</label>
                                    <div className="relative">
                                        <select
                                            value={selectedObject.fontFamily}
                                            onChange={(e) => onFontChange(e.target.value)}
                                            className="w-full text-xs font-serif p-3.5 pr-10 border border-gold/30 rounded-xl bg-white outline-none focus:border-maroon appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="Playfair Display">Luxury (Playfair)</option>
                                            <option value="Outfit">Modern (Outfit)</option>
                                            <option value="serif">Classic Serif</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold text-xs">▼</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Font Size</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={selectedObject.fontSize}
                                                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                                                className="w-full text-xs font-bold p-3 border border-gold/30 rounded-xl outline-none focus:border-maroon shadow-sm"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gold uppercase">px</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Spacing</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={selectedObject.charSpacing / 10 || 0}
                                                onChange={(e) => onLetterSpacing(parseInt(e.target.value) * 10)}
                                                className="w-full text-xs font-bold p-3 border border-gold/30 rounded-xl outline-none focus:border-maroon shadow-sm"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gold uppercase">ls</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1 text-center">Text Color</label>
                                    <div className="flex flex-wrap gap-2 justify-center bg-white p-3 rounded-xl border border-gold/10 shadow-sm">
                                        {['#800000', '#D4AF37', '#000000', '#FFFFFF', '#4A0000', '#B38B2D', '#222'].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => onObjectColorChange(color)}
                                                className="w-6 h-6 rounded-full border border-gold/20 shadow-sm hover:scale-125 transition-transform"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1 text-center">Alignment</label>
                                    <div className="flex bg-white rounded-xl border border-gold/30 p-1.5 shadow-sm">
                                        {['left', 'center', 'right'].map((align) => (
                                            <button
                                                key={align}
                                                onClick={() => onAlignChange(align as any)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedObject.textAlign === align ? 'bg-maroon text-white shadow-md scale-105' : 'text-gray-400 hover:text-maroon hover:bg-gold/5'}`}
                                            >
                                                {align}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1 text-center">Align to Board</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => onAlignBoard('left')} className="p-2.5 bg-white border border-gold/20 rounded-lg text-xs hover:bg-gold/5 transition-all shadow-sm">⇠ Left</button>
                                        <button onClick={() => onAlignBoard('center')} className="p-2.5 bg-white border border-gold/20 rounded-lg text-xs hover:bg-gold/5 transition-all shadow-sm">↔ Center</button>
                                        <button onClick={() => onAlignBoard('right')} className="p-2.5 bg-white border border-gold/20 rounded-lg text-xs hover:bg-gold/5 transition-all shadow-sm">Right ⇢</button>
                                        <button onClick={() => onAlignBoard('top')} className="p-2.5 bg-white border border-gold/20 rounded-lg text-xs hover:bg-gold/5 transition-all shadow-sm">⤒ Top</button>
                                        <button onClick={() => onAlignBoard('bottom')} className="p-2.5 bg-white border border-gold/20 rounded-lg text-xs hover:bg-gold/5 transition-all shadow-sm">⤓ Bottom</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gold/10 shadow-sm mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-maroon uppercase tracking-widest">Text Shadow</span>
                                        <span className="text-[9px] text-gray-400 font-bold">Adds luxury depth</span>
                                    </div>
                                    <button
                                        onClick={() => onTextShadow(!selectedObject.shadow)}
                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${selectedObject.shadow ? 'bg-maroon shadow-inner' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${selectedObject.shadow ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6 bg-cream/5 rounded-[2rem] border-2 border-dashed border-gold/20 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg border border-gold/10 opacity-30">✍️</div>
                                <div className="text-xs text-gray-400 font-medium font-serif leading-relaxed">Select existing text on the canvas to edit or click the button above to add fresh text</div>
                            </div>
                        )}
                    </div>
                )}

                {/* ... Rest of the tabs kept consistent with improved visibility ... */}
                {activeTab === 'bg' && (
                    <div className="animate-fadeIn space-y-8">
                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Silk Palette</h4>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {BACKGROUND_PRESETS.solids.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => onColorChange(color)}
                                        className={`aspect-square rounded-xl border-2 transition-all shadow-sm hover:scale-110 active:scale-95 ${onColorChange === (color as any) ? 'border-maroon shadow-md' : 'border-white'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Background Textures</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {BACKGROUND_PRESETS.textures.map((tex) => (
                                    <button
                                        key={tex.name}
                                        onClick={() => onTextureChange(tex.url)}
                                        className="aspect-square rounded-xl border border-gold/10 hover:border-gold transition-all shadow-sm overflow-hidden relative group"
                                    >
                                        <img src={tex.url} alt={tex.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        <span className="absolute bottom-1 left-0 w-full text-[7px] font-black text-white uppercase text-center bg-black/40 py-0.5">{tex.name}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => onTextureChange('none')}
                                    className="aspect-square rounded-xl border-2 border-dashed border-red-100 flex flex-col items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all bg-white"
                                >
                                    <span className="text-sm">🚫</span>
                                    <span className="text-[7px] font-black uppercase">CLEAR</span>
                                </button>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Luxury Florals</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {BACKGROUND_PRESETS.florals.map((floral) => (
                                    <button
                                        key={floral.name}
                                        onClick={() => onTextureChange(floral.url)}
                                        className="h-20 rounded-xl border border-gold/10 hover:border-gold transition-all shadow-sm overflow-hidden relative group bg-white"
                                    >
                                        <img src={floral.url} alt={floral.name} className="w-full h-full object-contain p-2" />
                                        <span className="absolute bottom-1 left-2 text-[8px] font-black text-maroon uppercase tracking-widest">{floral.name}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Board Effects</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {BACKGROUND_PRESETS.effects.map((effect) => (
                                    <button
                                        key={effect.id}
                                        onClick={() => onApplyEffect(effect.id)}
                                        className="p-3 bg-white border border-gold/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-maroon hover:bg-gold/5 hover:border-gold transition-all shadow-sm flex flex-col items-center gap-2 group active:scale-95"
                                    >
                                        <div className={`w-full h-8 rounded-lg bg-cream/30 border border-gold/10 flex items-center justify-center text-lg group-hover:scale-105 transition-transform ${effect.id}`}>
                                            {effect.id === 'vignette' && '🔲'}
                                            {effect.id === 'glitter' && '✨'}
                                            {effect.id === 'noise' && '🌫️'}
                                            {effect.id === 'texture-paper' && '📜'}
                                        </div>
                                        <span>{effect.name}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => onApplyEffect('none')}
                                    className="p-3 bg-white border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm col-span-2 flex flex-col items-center gap-2 active:scale-95"
                                >
                                    <div className="w-full h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">🚫</div>
                                    <span>Clear Effects</span>
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'elements' && (
                    <div className="animate-fadeIn space-y-8">
                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Tradition Motifs</h4>
                            </div>

                            {selectedObject && (
                                <button
                                    onClick={onDelete}
                                    style={{ backgroundColor: '#FFF0F0', color: '#B91C1C', border: '2px solid #FEE2E2' }}
                                    className="w-full mb-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <span>🗑️</span>
                                    <span>DELETE SELECTED</span>
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                {MOTIFS.map((motif) => (
                                    <button
                                        key={motif.id}
                                        onClick={() => onAddMotif(motif)}
                                        className="p-6 border border-gold/10 rounded-2xl hover:border-gold hover:bg-gold/5 transition-all bg-white shadow-sm flex flex-col items-center gap-3 group active:scale-95 border-b-4 hover:shadow-lg"
                                    >
                                        <div className="text-3xl transition-transform duration-300 group-hover:rotate-12">{motif.emoji}</div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{motif.name}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Shapes</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button onClick={() => onAddShape('rect')} className="aspect-square flex flex-col items-center justify-center border border-gold/20 rounded-xl bg-white hover:bg-gold/5 transition-all group">
                                    <div className="w-8 h-8 bg-maroon mb-1 shadow-sm" />
                                    <span className="text-[8px] font-black text-gray-400 group-hover:text-maroon">RECT</span>
                                </button>
                                <button onClick={() => onAddShape('circle')} className="aspect-square flex flex-col items-center justify-center border border-gold/20 rounded-xl bg-white hover:bg-gold/5 transition-all group">
                                    <div className="w-8 h-8 bg-maroon rounded-full mb-1 shadow-sm" />
                                    <span className="text-[8px] font-black text-gray-400 group-hover:text-maroon">CIRCLE</span>
                                </button>
                                <button onClick={() => onAddShape('triangle')} className="aspect-square flex flex-col items-center justify-center border border-gold/20 rounded-xl bg-white hover:bg-gold/5 transition-all group">
                                    <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-maroon mb-1 shadow-sm" />
                                    <span className="text-[8px] font-black text-gray-400 group-hover:text-maroon">TRI</span>
                                </button>
                            </div>

                            {selectedObject?.type === 'FabricImage' && (
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1">
                                        <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Image Layout</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onClipImage('rect')}
                                            className="flex-1 py-2.5 bg-white border border-gold/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gold/5 transition-all active:scale-95 shadow-sm"
                                        >
                                            Rectangle
                                        </button>
                                        <button
                                            onClick={() => onClipImage('round')}
                                            className="flex-1 py-2.5 bg-white border border-gold/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gold/5 transition-all active:scale-95 shadow-sm"
                                        >
                                            Round Cut
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="mt-8">
                            <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1 mb-6">
                                <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Arrows</h4>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {['left', 'right', 'up', 'down'].map((dir) => (
                                    <button
                                        key={dir}
                                        onClick={() => onAddArrow(dir as any)}
                                        className="aspect-square flex items-center justify-center border border-gold/20 rounded-xl bg-white hover:bg-maroon hover:text-white text-maroon transition-all text-xl shadow-sm font-black"
                                    >
                                        {dir === 'left' && '←'}
                                        {dir === 'right' && '→'}
                                        {dir === 'up' && '↑'}
                                        {dir === 'down' && '↓'}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'layers' && (
                    <div className="animate-fadeIn space-y-6">
                        <h4 className="text-[11px] font-black text-maroon uppercase tracking-widest bg-gold/5 px-4 py-2 rounded-lg mb-6 text-center">Design Elements ({objects.length})</h4>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {objects.length === 0 ? (
                                <div className="text-center py-10 text-[9px] text-gray-400 uppercase font-black tracking-widest">Board is empty</div>
                            ) : (
                                [...objects].reverse().map((obj, i) => (
                                    <div
                                        key={`layer-item-${obj.id}`}
                                        onClick={() => onSelectObject(obj.ref)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${obj.isActive ? 'bg-maroon text-white border-maroon shadow-md' : 'bg-white border-gold/10 hover:border-gold/30'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${obj.isActive ? 'bg-white/20' : 'bg-gold/5 text-gold'}`}>
                                                {obj.type === 'i-text' ? 'T' : '🖼️'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black truncate max-w-[120px] uppercase tracking-tighter ${obj.isActive ? 'text-white' : 'text-maroon'}`}>
                                                    {obj.text && obj.text.length > 20 ? obj.text.substring(0, 20) + '...' : obj.text}
                                                </span>
                                                <span className="text-[8px] opacity-60 font-bold uppercase">{obj.type}</span>
                                            </div>
                                        </div>
                                        {obj.locked && <span className="text-[10px]">🔒</span>}
                                    </div>
                                ))
                            )}
                        </div>

                        {selectedObject && (
                            <div className="space-y-6 pt-6 border-t border-gold/10 animate-slideUp">
                                <div className="flex items-center gap-3 border-l-4 border-gold pl-3 py-1">
                                    <h4 className="text-[11px] font-black text-maroon uppercase tracking-[0.2em]">Layer Controls</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={onBringForward} className="p-4 bg-white border border-gold/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold/5 hover:border-gold transition-all shadow-sm flex flex-col items-center gap-2 active:translate-y-1 border-b-4">
                                        <span className="text-xl">☀️</span>
                                        <span>Bring Front</span>
                                    </button>
                                    <button onClick={onSendBackward} className="p-4 bg-white border border-gold/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold/5 hover:border-gold transition-all shadow-sm flex flex-col items-center gap-2 active:translate-y-1 border-b-4">
                                        <span className="text-xl">🌑</span>
                                        <span>Send Back</span>
                                    </button>
                                    <button onClick={onDuplicate} className="p-4 bg-white border border-gold/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold/5 hover:border-gold transition-all shadow-sm flex flex-col items-center gap-2 active:translate-y-1 border-b-4">
                                        <span className="text-xl">👥</span>
                                        <span>Duplicate</span>
                                    </button>
                                    <button onClick={onLock} className={`p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex flex-col items-center gap-2 active:translate-y-1 border-b-4 ${selectedObject.lockMovementX ? 'bg-maroon text-white border-maroon' : 'bg-white border-gold/20 text-maroon hover:bg-maroon/5'}`}>
                                        <span className="text-xl">{selectedObject.lockMovementX ? '🔒' : '🔓'}</span>
                                        <span>{selectedObject.lockMovementX ? 'Unlock' : 'Lock'}</span>
                                    </button>
                                </div>

                                <button
                                    onClick={onDelete}
                                    className="w-full p-5 bg-[#FFF0F0] text-red-600 border-2 border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95 flex items-center justify-center gap-3 mt-6"
                                >
                                    <span>🗑️</span>
                                    <span>Delete Permanently</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
