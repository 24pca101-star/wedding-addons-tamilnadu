"use client";

import { Upload, ChevronRight, Info } from "lucide-react";
import { useState } from "react";
import { useFabric } from "@/context/FabricContext";
import * as fabric from "fabric";

export default function ToteBagUploadPanel() {
    const { canvas } = useFabric();
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | undefined;

        if (e.target && "files" in e.target && (e.target as HTMLInputElement).files) {
            file = (e.target as HTMLInputElement).files![0];
        } else if ("dataTransfer" in e && (e as React.DragEvent).dataTransfer.files) {
            file = (e as React.DragEvent).dataTransfer.files[0];
        }

        if (!file || !canvas) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            fabric.FabricImage.fromURL(data).then((img) => {
                const isAutomated = false; // Default to manual mode now

                if (isAutomated) {
                    // Start fresh for a perfect automated mockup
                    canvas.getObjects().forEach(obj => canvas.remove(obj));
                }

                // Professional Auto-Mockup Scaling: 
                const targetSize = Math.min(canvas.width! * 0.8, canvas.height! * 0.8);
                const scale = Math.min(targetSize / img.width!, targetSize / img.height!);

                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    originX: 'center',
                    originY: 'center',
                    // Disable interactions in automated mode for a "locked" look
                    selectable: !isAutomated,
                    evented: !isAutomated,
                    hasControls: !isAutomated
                });

                canvas.add(img);
                canvas.centerObject(img);
                if (!isAutomated) canvas.setActiveObject(img);
                canvas.requestRenderAll();

                // Trigger preview update
                canvas.fire("object:modified");
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-5 flex flex-col gap-6 h-full bg-white select-none">
            <div>
                <h3 className="text-lg font-black text-gray-900 font-sans tracking-tight">Upload images</h3>
            </div>

            {/* Main Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${isDragging ? "border-pink-500 bg-pink-50" : "border-pink-200 bg-pink-50/30 hover:border-pink-400 hover:bg-pink-50/50"
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e); }}
            >
                <input
                    type="file"
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                />

                <div className="mb-6 relative">
                    <div className="w-16 h-12 border-2 border-pink-400 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-pink-100/50" />
                        <ImageIcon className="text-pink-500 z-10" size={28} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white" />
                </div>

                <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-100 mb-3 active:scale-95">
                    <Upload size={18} />
                    <span>Upload</span>
                </button>

                <p className="text-[11px] font-bold text-pink-400">831 x 1058 px</p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3">
                <button className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
                    <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-1 transition-transform">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom material</span>
                        <span className="text-sm font-black text-gray-800">White cardboard</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
                </button>

                <button className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
                    <span className="text-sm font-black text-gray-800 translate-x-0 group-hover:translate-x-1 transition-transform">Find similar with AI</span>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
                </button>
            </div>

            <div className="mt-auto flex items-center gap-2 px-1">
                <Info size={14} className="text-gray-300" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Model ID: 610020</span>
            </div>
        </div>
    );
}

function ImageIcon({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    )
}
