"use client";

import React from 'react';
import { Sparkles, MessageSquare, Wand2, Lightbulb } from 'lucide-react';

export default function AIPanel() {
    return (
        <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300">
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="text-pink-600" size={20} />
                    </div>
                    <h2 className="text-xl font-serif font-black text-pink-900">AI Assistant</h2>
                </div>
                <p className="text-sm text-gray-500 italic">"Intelligent design at your fingertips."</p>
            </header>

            <div className="space-y-4">
                {/* Product Context Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-full w-fit border border-pink-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Tote Bag Context</span>
                </div>

                {/* AI Features */}
                <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group shadow-sm hover:shadow-md">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                            <MessageSquare className="text-rose-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Generate Content</h3>
                            <p className="text-[10px] text-gray-400">Write catchy headings & quotes</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group shadow-sm hover:shadow-md">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Wand2 className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Smart Layout</h3>
                            <p className="text-[10px] text-gray-400">Auto-align elements perfectly</p>
                        </div>
                    </button>
                </div>

                {/* Quick Suggestions Section */}
                <div className="mt-4">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Lightbulb size={14} className="text-amber-500" />
                        Quick Suggestions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="p-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-pink-200 rounded-xl transition-all text-left">
                            <span className="text-[10px] font-bold text-gray-700 block mb-1">Elegant Serif</span>
                            <span className="text-[8px] text-gray-400">Apply classic wedding typography</span>
                        </button>
                        <button className="p-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-pink-200 rounded-xl transition-all text-left">
                            <span className="text-[10px] font-bold text-gray-700 block mb-1">Floral Accents</span>
                            <span className="text-[8px] text-gray-400">Add subtle botanical elements</span>
                        </button>
                        <button className="p-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-pink-200 rounded-xl transition-all text-left">
                            <span className="text-[10px] font-bold text-gray-700 block mb-1">Royal Gold</span>
                            <span className="text-[8px] text-gray-400">Elevate with premium metallic tones</span>
                        </button>
                        <button className="p-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-pink-200 rounded-xl transition-all text-left">
                            <span className="text-[10px] font-bold text-gray-700 block mb-1">Minimalist</span>
                            <span className="text-[8px] text-gray-400">Clean, modern spacing & colors</span>
                        </button>
                    </div>
                </div>

                {/* Chat Placeholder */}
                <div className="mt-8 bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                        <Sparkles size={100} color="white" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="px-2 py-0.5 bg-pink-500/20 rounded text-[8px] font-black text-pink-400 uppercase tracking-widest border border-pink-500/30">Beta</div>
                            <h3 className="text-white font-bold text-sm">AI Design Chat</h3>
                        </div>
                        <p className="text-gray-400 text-[10px] leading-relaxed">
                            Describe your vision and watch the AI transform your design in real-time.
                        </p>
                        <button className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-gray-300 uppercase tracking-widest transition-all">
                            Join Waitlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
