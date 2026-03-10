"use client";

import { Sparkles, Layers, Type, Layout, Square, Upload, Home } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
    activePanel: "text" | "elements" | "uploads" | "shapes" | "ai" | "layers";
    setActivePanel: (panel: "text" | "elements" | "uploads" | "shapes" | "ai" | "layers") => void;
};

export default function Sidebar({ activePanel, setActivePanel }: SidebarProps) {
    const menuItems = [
        { id: "text", icon: Type, label: "Text" },
        { id: "elements", icon: Layout, label: "Elements" },
        { id: "shapes", icon: Square, label: "Shapes" },
        { id: "uploads", icon: Upload, label: "Uploads" },
        { id: "ai", icon: Sparkles, label: "AI Help" },
        { id: "layers", icon: Layers, label: "Layers" },
    ] as const;

    return (
        <div className="w-20 bg-gray-900 flex flex-col items-center py-4 gap-4 z-20 overflow-y-auto scrollbar-hide">
            <Link href="/" className="group flex flex-col items-center gap-1 mb-0 shrink-0">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-pink-500/20">
                    <span className="text-white font-black text-xs text-center leading-tight">STUDIO</span>
                </div>
            </Link>

            <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors shrink-0" title="Go to Home">
                <Home size={22} />
                <span className="text-[10px] font-medium uppercase tracking-tighter">Home</span>
            </Link>

            <div className="h-[1px] w-10 bg-gray-800 shrink-0 my-1" />

            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id)}
                    className={`flex flex-col items-center gap-1 transition-colors shrink-0 ${activePanel === item.id ? "text-pink-500" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <item.icon size={22} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    );
}
