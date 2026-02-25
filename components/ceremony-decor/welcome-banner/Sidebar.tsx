"use client";

import { Layout, Type, Image, Square, Upload, Home } from "lucide-react";
import Link from "next/link";

type Props = {
    activePanel: "text" | "elements" | "uploads" | "shapes";
    setActivePanel: (panel: "text" | "elements" | "uploads" | "shapes") => void;
};

export default function Sidebar({ activePanel, setActivePanel }: Props) {
    const menuItems = [
        { id: "text", icon: Type, label: "Text" },
        { id: "elements", icon: Layout, label: "Elements" },
        { id: "shapes", icon: Square, label: "Shapes" },
        { id: "uploads", icon: Upload, label: "Uploads" },
    ] as const;

    return (
        <div className="w-20 bg-gray-900 flex flex-col items-center py-6 gap-8 z-20">
            <Link href="/" className="group flex flex-col items-center gap-1 mb-2">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-pink-500/20">
                    <span className="text-white font-black text-xs text-center leading-tight">STUDIO</span>
                </div>
            </Link>

            <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors mb-4" title="Go to Home">
                <Home size={24} />
                <span className="text-[10px] font-medium uppercase tracking-tighter">Home</span>
            </Link>

            <div className="h-[1px] w-10 bg-gray-800 mb-2" />

            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id)}
                    className={`flex flex-col items-center gap-1 transition-colors ${activePanel === item.id ? "text-pink-500" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <item.icon size={24} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    );
}
