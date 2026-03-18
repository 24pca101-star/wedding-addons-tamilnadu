"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2 } from 'lucide-react';

interface TemplateUploadCardProps {
    category: string;
    subcategory: string;
}

export default function TemplateUploadCard({ category, subcategory }: TemplateUploadCardProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFile = async (file: File) => {
        if (!file.name.toLowerCase().endsWith('.psd')) {
            alert('Please upload a valid PSD file.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('psd', file);

        try {
            const response = await fetch('http://localhost:5005/api/psd/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            if (data.success && data.filename) {
                // Redirect to editor with the new template filename
                router.push(`/editor/${category}/${subcategory}?template=${data.filename}`);
            }
        } catch (error) {
            console.error('PSD Upload Error:', error);
            alert('Failed to upload PSD. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border-2 border-dashed flex flex-col h-full min-h-[250px] ${
                isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".psd"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
                        <p className="text-sm font-bold text-gray-700 animate-pulse">Parsing PSD Layers...</p>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <Upload className="text-pink-600 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-2">Upload Your PSD</h3>
                        <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
                            Drag & drop your customized PSD here to edit layers instantly
                        </p>
                    </>
                )}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-1 rounded">
                        PRO FEATURE
                    </span>
                    <div className="flex items-center gap-1 text-gray-300 group-hover:text-pink-400 transition-colors">
                        <span className="text-[10px] font-bold">PSD SUPPORTED</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                </div>
            </div>

            {isDragging && (
                <div className="absolute inset-0 bg-pink-500/10 pointer-events-none flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-pink-200">
                        <span className="text-pink-600 font-bold text-sm">Drop PSD here!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
