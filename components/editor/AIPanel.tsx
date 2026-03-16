"use client";

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Wand2, Lightbulb, Loader2, Send, Image as ImageIcon } from 'lucide-react';
import { useFabric } from '@/context/FabricContext';
import * as fabric from 'fabric';

export default function AIPanel() {
    const { canvas, selectedObject, replaceImage } = useFabric();
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isImageSelected = selectedObject && selectedObject.type === 'image';

    const handleGenerate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const response = await fetch("/api/freepik", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.base64) {
                 setGeneratedImage(`data:image/jpeg;base64,${data.base64}`);
            } else if (data.data?.[0]?.base64) {
                 setGeneratedImage(`data:image/jpeg;base64,${data.data[0].base64}`);
            } else if (data.url || data.data?.[0]?.url) {
                 setGeneratedImage(data.url || data.data[0].url);
            } else {
                 throw new Error("Invalid response format from Freepik");
            }
            
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to generate image");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleInsert = () => {
        if (!generatedImage || !canvas) return;

        if (isImageSelected) {
            replaceImage(generatedImage);
        } else {
            fabric.FabricImage.fromURL(generatedImage).then((img) => {
                const targetSize = Math.min(canvas.width! * 0.7, canvas.height! * 0.7);
                const scale = Math.min(targetSize / img.width!, targetSize / img.height!);

                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    originX: 'center',
                    originY: 'center',
                    shadow: new fabric.Shadow({
                        color: 'rgba(0,0,0,0.1)',
                        blur: 10,
                        offsetX: 0,
                        offsetY: 4
                    })
                });

                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
                canvas.fire("object:modified");
            });
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300 h-full">
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="text-pink-600" size={20} />
                    </div>
                    <h2 className="text-xl font-serif font-black text-pink-900">AI Design</h2>
                </div>
                <p className="text-sm text-gray-500 italic">"Generate assets with Freepik AI"</p>
            </header>

            <div className="flex-1 flex flex-col space-y-4">
                
                {/* Generation Area */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
                    {/* Prompt Input Area */}
                    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
                        <form onSubmit={handleGenerate}>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate... e.g., 'aesthetic floral wedding border'"
                                className="w-full p-4 min-h-[100px] resize-none focus:outline-none text-sm text-gray-700 bg-transparent"
                                disabled={isGenerating}
                            />
                            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t">
                                <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    Prompts
                                </span>
                                <button
                                    type="submit"
                                    disabled={isGenerating || !prompt.trim()}
                                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-pink-200"
                                >
                                    {isGenerating ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                    Generate
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick Prompts (clickable) */}
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setPrompt("elegant rose gold floral corner border, watercolor style, transparent background, isolated")}
                            className="p-3 bg-gray-50 hover:bg-pink-50 border border-gray-100 hover:border-pink-200 rounded-xl transition-all text-left text-[10px] font-bold text-gray-600"
                        >
                            Rose Gold Florals
                        </button>
                        <button 
                            onClick={() => setPrompt("minimalist geometric gold frame with subtle green leaves, elegant")}
                            className="p-3 bg-gray-50 hover:bg-pink-50 border border-gray-100 hover:border-pink-200 rounded-xl transition-all text-left text-[10px] font-bold text-gray-600"
                        >
                            Geometric Frame
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Generated Image Result */}
                    {generatedImage && (
                        <div className="mt-4 p-4 border border-pink-100 bg-pink-50/30 rounded-2xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <span className="text-[10px] uppercase font-black tracking-widest text-pink-600 zelf-start w-full text-center">Generated Result</span>
                            <div className="relative group w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-black/5 bg-gray-100 flex items-center justify-center">
                                <img src={generatedImage} alt="AI Generated" className="object-contain w-full h-full" />
                            </div>
                            
                            <button
                                onClick={handleInsert}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-md shadow-pink-200 transition-all hover:-translate-y-0.5"
                            >
                                <ImageIcon size={18} />
                                {isImageSelected ? "Replace Selected Layer" : "Add to Canvas"}
                            </button>
                            
                            {isImageSelected && (
                                <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                                    The active layer <strong className="font-bold text-gray-700">will be replaced</strong> with this image while preserving its position, size, and rotation.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
