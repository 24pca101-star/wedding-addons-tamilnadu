"use client";

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Wand2, Lightbulb, Loader2, Send, Image as ImageIcon } from 'lucide-react';
import { useFabric } from '@/context/FabricContext';
import * as fabric from 'fabric';

export default function AIPanel() {
    const { canvas, selectedObject, replaceImage } = useFabric();
    const [prompt, setPrompt] = useState("");
    const [autoRemove, setAutoRemove] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAlreadyTransparent, setIsAlreadyTransparent] = useState(false); // New state variable

    const isImageSelected = selectedObject && selectedObject.type === 'image';

    const handleMagicReplace = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim() || !isImageSelected) return;

        setIsGenerating(true);
        setError(null);
        setIsAlreadyTransparent(false); // Reset transparency status at the start of a new generation

        const enhancedPrompt = autoRemove 
            ? `${prompt}, isolated on white background, sharp focus, professional lighting, high quality, 4k`
            : `${prompt}, high quality, 4k`;
        
        const baseNegative = "frame, border, messy, blur, text, watermark";
        const negativePrompt = prompt.toLowerCase().includes('corner') 
            ? `${baseNegative}, square layout, full frame` 
            : baseNegative;

        try {
            const response = await fetch("/api/freepik", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    negative_prompt: negativePrompt,
                    guidance_scale: 2.0
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const detailedError = data.details ? `${data.error}: ${data.details}` : (data.error || `Server Error: ${response.status}`);
                throw new Error(detailedError);
            }

            const imageUrl = data.url;
            
            if (imageUrl) {
                // Call replaceImage with the new URL and transparency status
                (replaceImage as any)(imageUrl, autoRemove, data.isTransparent || false);
            } else {
                throw new Error("No image was returned from AI. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to replace image");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-5 flex flex-col gap-5 animate-in fade-in duration-500 h-full bg-[#F9F8FF]">
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-50 flex flex-col gap-4">
                <header className="flex items-center gap-2">
                    <Sparkles className="text-purple-500 fill-purple-100" size={18} />
                    <h2 className="text-sm font-black uppercase tracking-wider text-purple-700">AI Assist (Freepik)</h2>
                </header>

                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want to generate (e.g. 'Cute chibi boy')"
                        className="w-full p-4 min-h-[100px] bg-gray-50/50 border border-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                        disabled={isGenerating}
                    />
                </div>

                <div className="flex items-center gap-3 px-1">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            id="autoRemove"
                            checked={autoRemove}
                            onChange={(e) => setAutoRemove(e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-purple-200 bg-white checked:bg-purple-600 transition-all"
                        />
                        <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                    </div>
                    <label htmlFor="autoRemove" className="text-xs font-bold text-green-600 cursor-pointer select-none">
                        Transparent Background (Auto-Remove)
                    </label>
                </div>

                <button
                    onClick={handleMagicReplace}
                    disabled={isGenerating || !prompt.trim() || !isImageSelected}
                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-100 hover:shadow-purple-200 active:scale-[0.98]"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Generating HD...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className="fill-white/20" />
                            Magic Replace
                        </>
                    )}
                </button>

                {isGenerating && (
                    <p className="text-[10px] text-center text-purple-400 animate-pulse font-medium">
                        Processing image... This usually takes 10-15s.
                    </p>
                )}

                {!isGenerating && !isImageSelected && (
                    <p className="text-[10px] text-center text-gray-400 font-medium">
                        Please <strong className="text-gray-600">select an image</strong> on the canvas to use Magic Replace.
                    </p>
                )}

                {error && (
                    <p className="text-[11px] text-center text-red-500 font-bold bg-red-50 py-2 rounded-lg">
                        {error}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Quick Prompts</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: "Rose Gold Florals", prompt: "elegant rose gold floral corner border, watercolor style, isolated flower" },
                        { label: "Geometric Frame", prompt: "minimalist geometric gold frame with subtle green leaves, elegant" }
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setPrompt(item.prompt)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 text-left hover:border-purple-200 hover:bg-purple-50/30 transition-all active:scale-95"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
