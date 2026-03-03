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
                {/* AI Features */}
                <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                            <MessageSquare className="text-rose-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Generate Content</h3>
                            <p className="text-[10px] text-gray-400">Write catchy headings & quotes</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Wand2 className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Smart Layout</h3>
                            <p className="text-[10px] text-gray-400">Auto-align elements perfectly</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Lightbulb className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Design Suggestions</h3>
                            <p className="text-[10px] text-gray-400">Get color & font pairing ideas</p>
                        </div>
                    </button>
                </div>

                {/* Chat Placeholder */}
                <div className="mt-6 bg-linear-to-br from-pink-600 to-rose-600 p-6 rounded-3xl shadow-lg shadow-pink-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                        <Sparkles size={80} color="white" />
                    </div>
                    <h3 className="text-white font-bold mb-2 relative z-10">Coming Soon: AI Chat</h3>
                    <p className="text-pink-100 text-xs leading-relaxed relative z-10">
                        Chat directly with the AI to transform your designs through simple conversation.
                    </p>
                </div>
            </div>
        </div>
    );
}
