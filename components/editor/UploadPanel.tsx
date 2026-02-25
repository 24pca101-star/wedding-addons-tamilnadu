"use client";

import * as fabric from "fabric";
import { Upload, Image as ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useFabric } from "@/context/FabricContext";

export default function UploadPanel() {
    const { canvas } = useFabric();
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | undefined;

        if (e.target && "files" in e.target && e.target.files) {
            file = e.target.files[0];
        } else if ("dataTransfer" in e && e.dataTransfer.files) {
            file = e.dataTransfer.files[0];
        }

        if (!file || !canvas) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            fabric.FabricImage.fromURL(data).then((img) => {
                const scale = Math.min(200 / img.width!, 200 / img.height!);
                img.scale(scale);
                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
                canvas.fire("object:modified");
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-sans">Uploads</h3>

            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${isDragging ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-gray-50 hover:border-pink-300 hover:bg-white"
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

                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-pink-600" size={24} />
                </div>

                <h4 className="text-sm font-bold text-gray-800 mb-1">Upload an image</h4>
                <p className="text-xs text-gray-400 font-medium">Drag and drop or click to browse</p>
                <p className="text-[10px] text-gray-300 mt-4 uppercase font-bold tracking-tighter">Supports JPG, PNG, SVG</p>
            </div>

            <div className="mt-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Your Library</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-square bg-gray-50 rounded-xl border-2 border-gray-100 flex items-center justify-center">
                        <ImageIcon className="text-gray-200" size={32} />
                    </div>
                    <div className="aspect-square bg-gray-50 rounded-xl border-2 border-gray-100 flex items-center justify-center">
                        <Plus className="text-gray-200" size={32} />
                    </div>
                </div>
            </div>
        </div>
    );
}
