"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface PanelContainerProps {
    title: string;
    children: ReactNode;
    onClose?: () => void;
}

export default function PanelContainer({ title, children, onClose }: PanelContainerProps) {
    return (
        <div className="absolute top-6 left-24 w-[360px] max-h-[calc(100vh-120px)] bg-white/95 backdrop-blur-md shadow-2xl rounded-[32px] border border-white/50 z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="p-6 pb-2 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide">
                {children}
            </div>
        </div>
    );
}
