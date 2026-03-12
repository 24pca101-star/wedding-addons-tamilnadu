"use client";

import { Type, MapPin, Heart, Utensils, MousePointer2, Palette, Flower2 } from "lucide-react";
import { useFabric } from "@/context/FabricContext";
import * as fabric from "fabric";

const TEMPLATE_CATEGORIES = [
    {
        name: "Wedding Templates",
        icon: Flower2,
        templates: [
            "Wedding This Way →",
            "← Wedding This Way",
            "Reception →",
            "← Reception",
            "Parking →",
            "← Parking",
            "Dining →",
            "← Dining",
            "Bride Room →",
            "Groom Room →"
        ]
    }
];

const BOARD_STYLES = [
    { id: 'easel-arch', name: 'Luxury Arch' },
    { id: 'stake-floral', name: 'Floral Stake' },
    { id: 'easel-black-floral', name: 'Black Floral' },
    { id: 'easel-white', name: 'White Minimalist' },
    { id: 'easel-pre-gold', name: 'Gold & Acrylic' },
    { id: 'easel-pre-vintage', name: 'Vintage Ornate' },
    { id: 'easel-pre-black', name: 'Stylish Black' },
    { id: 'easel-custom-darkwood', name: 'Dark Wood' },
    { id: 'easel-custom-hanging', name: 'Hanging Gold' },
    { id: 'easel-custom-round', name: 'Round White' },
];

const DECORATIONS = [
    {
        name: "Premium Realistic Rose",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Outer petals -->
                <path d="M50 20C40 20 30 30 30 40C30 55 50 80 50 80C50 80 70 55 70 40C70 30 60 20 50 20Z" fill="#E11D48"/>
                <path d="M50 25C35 25 25 40 25 55C25 70 45 90 50 90C55 90 75 70 75 55C75 40 65 25 50 25Z" fill="#BE123C" opacity="0.8"/>
                <!-- Inner swirl -->
                <path d="M50 45C45 45 42 48 42 51C42 55 50 58 50 58C50 58 58 55 58 51C58 48 55 45 50 45Z" fill="white" opacity="0.4"/>
                <path d="M50 35C40 35 35 40 35 48C35 55 45 65 50 65C55 65 65 55 65 48C65 40 60 35 50 35Z" fill="#FB7185" opacity="0.6"/>
                <!-- Stem/Leaves -->
                <path d="M50 80L50 95" stroke="#166534" stroke-width="2" stroke-linecap="round"/>
                <path d="M50 85C40 85 35 75 35 75" stroke="#166534" stroke-width="2" stroke-linecap="round"/>
                <path d="M50 85C60 85 65 75 65 75" stroke="#166534" stroke-width="2" stroke-linecap="round"/>
              </svg>`
    },
    {
        name: "Vintage Gold Scroll",
        svg: `<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 30C10 10 40 10 40 30C40 50 160 50 160 30C160 10 190 10 190 30" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
                <path d="M40 30Q100 0 160 30" stroke="#D4AF37" stroke-width="1" opacity="0.5"/>
                <path d="M40 30Q100 60 160 30" stroke="#D4AF37" stroke-width="1" opacity="0.5"/>
                <circle cx="25" cy="20" r="3" fill="#D4AF37"/>
                <circle cx="175" cy="20" r="3" fill="#D4AF37"/>
              </svg>`
    },
    {
        name: "Floral Wedding Wreath",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="42" stroke="#166534" stroke-width="1" stroke-dasharray="2 4"/>
                <!-- Small flowers around -->
                <circle cx="50" cy="8" r="4" fill="#F472B6"/>
                <circle cx="80" cy="20" r="3" fill="#F472B6"/>
                <circle cx="92" cy="50" r="4" fill="#F472B6"/>
                <circle cx="80" cy="80" r="3" fill="#F472B6"/>
                <circle cx="50" cy="92" r="4" fill="#F472B6"/>
                <circle cx="20" cy="80" r="3" fill="#F472B6"/>
                <circle cx="8" cy="50" r="4" fill="#F472B6"/>
                <circle cx="20" cy="20" r="3" fill="#F472B6"/>
                <!-- Leaves -->
                <path d="M50 8C60 8 65 15 65 15" stroke="#4ADE80" stroke-width="1"/>
                <path d="M50 92C40 92 35 85 35 85" stroke="#4ADE80" stroke-width="1"/>
              </svg>`
    },
    {
        name: "Gold Hearts Frame",
        svg: `<svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 60C40 60 10 40 10 20C10 5 30 0 40 15C50 0 70 5 70 20C70 40 40 60 40 60Z" stroke="#D4AF37" stroke-width="3"/>
                <path d="M80 60C80 60 50 40 50 20C50 5 70 0 80 15C90 0 110 5 110 20C110 40 80 60 80 60Z" stroke="#FFD700" stroke-width="2" opacity="0.7"/>
              </svg>`
    },
    {
        name: "Luxury Mandala Corner",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5H95V15H15V95H5V5Z" fill="#D4AF37" opacity="0.2"/>
                <path d="M15 15L35 35M15 35L35 15" stroke="#D4AF37" stroke-width="1"/>
                <circle cx="15" cy="15" r="10" stroke="#D4AF37" stroke-width="2"/>
                <path d="M15 45C35 45 45 35 45 15" stroke="#D4AF37" stroke-width="1" stroke-dasharray="2 2"/>
                <path d="M15 65C50 65 65 50 65 15" stroke="#D4AF37" stroke-width="1.5"/>
                <path d="M15 85C70 85 85 70 85 15" stroke="#D4AF37" stroke-width="2"/>
              </svg>`
    },
    {
        name: "Golden Divider Swirl",
        svg: `<svg width="240" height="40" viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 20C40 10 60 30 80 20C100 10 120 10 140 20C160 30 180 10 220 20" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
                <circle cx="120" cy="20" r="4" fill="#D4AF37"/>
                <circle cx="20" cy="20" r="3" stroke="#D4AF37" stroke-width="2"/>
                <circle cx="220" cy="20" r="3" stroke="#D4AF37" stroke-width="2"/>
              </svg>`
    },
    {
        name: "Premium Satin Ribbon",
        svg: `<svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Ribbon Loops with Shading -->
                <path d="M60 30C40 0 5 10 5 35C5 55 35 60 60 45" fill="#FFC0CB" stroke="#FF69B4" stroke-width="1.5"/>
                <path d="M60 30C80 0 115 10 115 35C115 55 85 60 60 45" fill="#FFC0CB" stroke="#FF69B4" stroke-width="1.5"/>
                <!-- Inner loop shadows for depth -->
                <path d="M30 25Q15 25 15 35Q15 45 30 40" stroke="#FF69B4" stroke-width="0.5" opacity="0.4"/>
                <path d="M90 25Q105 25 105 35Q105 45 90 40" stroke="#FF69B4" stroke-width="0.5" opacity="0.4"/>
                <!-- Center Knot -->
                <rect x="54" y="25" width="12" height="18" rx="4" fill="#FF69B4"/>
                <path d="M54 30C54 30 57 32 60 32C63 32 66 30 66 30" stroke="white" stroke-width="1" opacity="0.5"/>
                <!-- Ribbon Tails -->
                <path d="M54 40L30 75L15 65L35 48" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1"/>
                <path d="M66 40L90 75L105 65L85 48" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1"/>
              </svg>`
    },
    {
        name: "Royal Laurel Wreath",
        svg: `<svg width="140" height="60" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 50Q40 45 70 50T130 50" stroke="#166534" stroke-width="2"/>
                <path d="M20 45C15 35 25 30 25 30Q30 35 25 45" fill="#4ADE80"/>
                <path d="M45 45C40 35 50 30 50 30Q55 35 50 45" fill="#4ADE80"/>
                <path d="M70 45C65 35 75 30 75 30Q80 35 75 45" fill="#4ADE80"/>
                <path d="M95 45C90 35 100 30 100 30Q105 35 100 45" fill="#4ADE80"/>
                <path d="M120 45C115 35 125 30 125 30Q130 35 125 45" fill="#4ADE80"/>
              </svg>`
    },
    {
        name: "Elegant Wedding Couple",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Groom -->
                <path d="M40 30Q40 20 45 20Q50 20 50 30Q50 40 45 40Q40 40 40 30Z" fill="#333"/>
                <path d="M45 40Q35 45 35 80H50V40H45Z" fill="#333"/>
                <!-- Bride -->
                <path d="M55 35Q55 25 60 25Q65 25 65 35Q65 45 60 45Q55 45 55 35Z" fill="#333"/>
                <path d="M60 45Q50 45 50 90H85Q85 45 60 45Z" fill="#F8FAFC" stroke="#333" stroke-width="0.5"/>
              </svg>`
    },
    {
        name: "Sparkling Wedding Rings",
        svg: `<svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="45" r="20" stroke="#D4AF37" stroke-width="4"/>
                <circle cx="65" cy="45" r="20" stroke="#FFD700" stroke-width="4"/>
                <path d="M35 25L35 15M30 20L40 20" stroke="#D4AF37" stroke-width="2"/>
                <path d="M65 25L65 15M60 20L70 20" stroke="#FFD700" stroke-width="2" opacity="0.6"/>
              </svg>`
    },
    {
        name: "Champagne Toast",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Glass 1 -->
                <path d="M42 65L42 85M32 85H52" stroke="#94A3B8" stroke-width="2"/>
                <path d="M42 65L32 25Q32 15 42 15Q52 15 52 25L42 65Z" fill="#FEF3C7" fill-opacity="0.5" stroke="#94A3B8" stroke-width="1.5"/>
                <!-- Glass 2 -->
                <path d="M58 65L58 85M48 85H68" stroke="#94A3B8" stroke-width="2"/>
                <path d="M58 65L68 25Q68 15 58 15Q48 15 48 25L58 65Z" fill="#FEF3C7" fill-opacity="0.5" stroke="#94A3B8" stroke-width="1.5"/>
                <!-- Fizz -->
                <circle cx="50" cy="15" r="1.5" fill="#FBBF24"/>
                <circle cx="45" cy="10" r="1" fill="#FBBF24" opacity="0.6"/>
                <circle cx="55" cy="8" r="1.2" fill="#FBBF24" opacity="0.8"/>
              </svg>`
    },
    {
        name: "Namaste Hands (Vanakkam)",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Outer Glow/Aura -->
                <circle cx="50" cy="50" r="48" fill="#FFF1F2" fill-opacity="0.5"/>
                
                <!-- Right Hand (slightly behind or matched) -->
                <path d="M50 90C65 85 80 65 80 45C80 30 70 15 50 10V90Z" fill="#FFF1F2" stroke="#BE123C" stroke-width="2.5" stroke-linejoin="round"/>
                
                <!-- Left Hand -->
                <path d="M50 90C35 85 20 65 20 45C20 30 30 15 50 10V90Z" fill="#FFF1F2" stroke="#BE123C" stroke-width="2.5" stroke-linejoin="round"/>
                
                <!-- Thumb details for realism -->
                <path d="M35 80C30 75 25 65 25 55" stroke="#BE123C" stroke-width="2" stroke-linecap="round"/>
                <path d="M65 80C70 75 75 65 75 55" stroke="#BE123C" stroke-width="2" stroke-linecap="round"/>
                
                <!-- Fingers definition -->
                <path d="M40 45C40 35 42 25 45 20" stroke="#BE123C" stroke-width="1.2" opacity="0.6" stroke-linecap="round"/>
                <path d="M60 45C60 35 58 25 55 20" stroke="#BE123C" stroke-width="1.2" opacity="0.6" stroke-linecap="round"/>
                
                <!-- Subtle Center line to show join -->
                <path d="M50 15V85" stroke="#BE123C" stroke-width="0.8" opacity="0.3"/>
              </svg>`
    },
    {
        name: "Golden Sparkle Star",
        svg: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Main Star -->
                <path d="M50 10 L54 44 L90 50 L54 56 L50 90 L46 56 L10 50 L46 44 Z" fill="#FFD700" stroke="#D4AF37" stroke-width="1"/>
                <!-- Secondary Glint -->
                <path d="M50 25 L52 48 L75 50 L52 52 L50 75 L48 52 L25 50 L48 48 Z" fill="white" opacity="0.8"/>
                <!-- Sparkle points -->
                <circle cx="20" cy="20" r="2" fill="#FFD700"/>
                <circle cx="80" cy="80" r="2" fill="#FFD700"/>
                <circle cx="80" cy="20" r="1.5" fill="#FFD700"/>
                <circle cx="20" cy="80" r="1.5" fill="#FFD700"/>
              </svg>`
    },
    {
        name: "Classic Wedding Car",
        svg: `<svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 45H110L105 25H15L10 45Z" fill="#333"/>
                <path d="M30 25L40 10H80L90 25" stroke="#333" stroke-width="2" fill="white" fill-opacity="0.3"/>
                <circle cx="25" cy="45" r="8" fill="#1A1A1A" stroke="white" stroke-width="2"/>
                <circle cx="95" cy="45" r="8" fill="#1A1A1A" stroke="white" stroke-width="2"/>
                <path d="M110 40C115 40 120 45 120 45L110 50" stroke="#FF69B4" stroke-width="1.5"/>
                <text x="50" y="40" font-family="Arial" font-size="6" fill="white">JUST MARRIED</text>
              </svg>`
    },
    {
        name: "Fine Dining Set",
        svg: `<svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="40" r="30" stroke="#94A3B8" stroke-width="2" fill="white"/>
                <circle cx="50" cy="40" r="22" stroke="#E2E8F0" stroke-width="1"/>
                <!-- Fork -->
                <path d="M15 20V50M10 20Q10 30 15 30Q20 30 20 20M15 30V20" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
                <!-- Knife -->
                <path d="M85 20V60M85 20Q80 20 80 35H85" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
              </svg>`
    },
    {
        name: "Mauve Rose Cluster",
        image: "/assets/decorations/mauve-realistic.png"
    },
    {
        name: "Cascading Pink Floral",
        image: "/assets/decorations/pink-waterfall-realistic.png"
    },
    {
        name: "White Rose Cluster",
        image: "/assets/decorations/white-cluster-realistic.png"
    },
    {
        name: "Simple Line",
        svg: `<svg width="100" height="2" viewBox="0 0 100 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="2" fill="#D4AF37"/>
              </svg>`
    }
];

export default function WeddingTemplatesPanel() {
    const { addText, canvas, setBackgroundImage, isPreview } = useFabric();

    const handleBoardChange = (boardId: string) => {
        if (!canvas) return;
        const noBgPath = `/assets/mockups/directional-boards/${boardId}-no-bg.png`;
        setBackgroundImage(noBgPath);
    };

    const handleAddTemplate = (text: string) => {
        if (!canvas) return;
        addText(text);

        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set({
                width: 300,
                fontSize: 32,
                fontFamily: "Outfit, Inter, sans-serif",
                textAlign: "center"
            });
            canvas.centerObject(activeObject);
            canvas.requestRenderAll();
        }
    };

    const handleAddDecoration = async (item: { svg?: string; image?: string; name: string }) => {
        if (!canvas) return;

        const maxBoardDimension = Math.min(canvas.width!, canvas.height!);
        const targetDim = maxBoardDimension * 0.45; // 45% of board size

        try {
            if (item.svg) {
                const { objects } = await fabric.loadSVGFromString(item.svg);

                // Critical fix: filter nulls and maintain structure
                const validObjects = objects.filter(obj => obj !== null) as fabric.FabricObject[];

                // Create a group that matches the visual center precisely
                const group = new fabric.Group(validObjects, {
                    originX: 'center',
                    originY: 'center',
                });

                if (group.width! > targetDim || group.height! > targetDim) {
                    const scale = targetDim / Math.max(group.width!, group.height!);
                    group.scale(scale);
                }

                canvas.add(group);
                canvas.centerObject(group);
                canvas.setActiveObject(group);
                canvas.requestRenderAll();
            } else if (item.image) {
                const img = await fabric.FabricImage.fromURL(item.image);

                if (img.width! > targetDim || img.height! > targetDim) {
                    const scale = targetDim / Math.max(img.width!, img.height!);
                    img.scale(scale);
                }

                img.set({
                    originX: 'center',
                    originY: 'center'
                });

                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
            }
        } catch (err) {
            console.error("Failed to add premium decoration:", err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white select-none">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10">
                <h3 className="text-xl font-black text-gray-900 font-sans tracking-tight flex items-center gap-2">
                    <Flower2 className="text-pink-500" size={24} />
                    Wedding Signs
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Design Studio</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-10 scrollbar-hide py-6">

                {/* 0. BOARD STYLES */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Palette className="text-pink-500" size={16} />
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
                            Board Styles
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {BOARD_STYLES.map((board) => (
                            <button
                                key={board.id}
                                onClick={() => handleBoardChange(board.id)}
                                disabled={isPreview}
                                className={`group flex flex-col items-center gap-2 p-2 rounded-xl border border-transparent transition-all ${isPreview ? 'opacity-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-pink-50/50 hover:border-pink-100 active:scale-[0.95]'}`}
                                title={isPreview ? "Exit preview to change board" : board.name}
                            >
                                <div className="w-full aspect-square bg-white rounded-lg overflow-hidden border border-gray-100">
                                    <img
                                        src={`/assets/mockups/directional-boards/${board.id}.png`}
                                        alt={board.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="text-[9px] font-bold text-gray-500 group-hover:text-pink-600 transition-colors truncate w-full text-center">
                                    {board.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-gray-50 mx-2" />

                {/* 1. WEDDING TEMPLATES */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Type className="text-pink-500" size={16} />
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
                            Wedding Templates
                        </h4>
                    </div>
                    <div className="grid gap-2">
                        {TEMPLATE_CATEGORIES[0].templates.map((template) => (
                            <button
                                key={template}
                                onClick={() => handleAddTemplate(template)}
                                disabled={isPreview}
                                className={`group flex items-center justify-between p-4 rounded-2xl border border-transparent transition-all text-left ${isPreview ? 'opacity-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-pink-50/50 hover:border-pink-100 active:scale-[0.98]'}`}
                            >
                                <span className="text-sm font-bold text-gray-700 group-hover:text-pink-600 transition-colors">
                                    {template}
                                </span>
                                <MousePointer2 size={14} className="text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-gray-50 mx-2" />

                {/* 2. DECORATIONS */}
                <section className="space-y-4 pb-6">
                    <div className="flex items-center gap-2 px-1">
                        <Palette className="text-pink-500" size={16} />
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
                            Decorations
                        </h4>
                    </div>
                    <div className="grid gap-3">
                        {DECORATIONS.map((decor) => (
                            <button
                                key={decor.name}
                                onClick={() => handleAddDecoration(decor)}
                                disabled={isPreview}
                                className={`group flex items-center gap-4 p-4 rounded-2xl border border-transparent transition-all text-left ${isPreview ? 'opacity-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-white hover:border-pink-100 hover:shadow-xl hover:shadow-pink-500/5 active:scale-[0.98]'}`}
                            >
                                <div
                                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform shadow-sm"
                                >
                                    {decor.svg ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: decor.svg }}
                                            className="w-full h-full p-2 flex items-center justify-center text-gray-400 group-hover:text-pink-500 transition-colors"
                                        />
                                    ) : decor.image ? (
                                        <img
                                            src={decor.image}
                                            alt={decor.name}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    ) : null}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight">
                                        {decor.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">Click to add decoration</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer Tip */}
            <div className="p-6 bg-pink-50/30 border-t border-pink-50 shrink-0">
                <div className="flex gap-2">
                    <Type className="text-pink-400 shrink-0" size={14} />
                    <p className="text-[10px] text-pink-700 leading-relaxed font-bold">
                        Tip: Select any element on the board to change its color, size, or position.
                    </p>
                </div>
            </div>
        </div>
    );
}
