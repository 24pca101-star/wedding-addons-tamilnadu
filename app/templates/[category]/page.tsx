"use client";
import React, { useState, useEffect } from 'react';
import TemplateCard from "@/components/TemplateCard";
import axios from 'axios';

interface Template {
    id: string;
    name: string;
    preview: string;
    category: string;
    subcategory: string;
}

export default function PsdTemplatesPage({ params }: { params: { category: string } }) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/psd/templates');
            // Filter by category if needed, or mapping them
            const mapped = response.data.map((t: any) => ({
                ...t,
                category: params.category,
                subcategory: 'welcome-banner' // Default for now
            }));
            setTemplates(mapped);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [params.category]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('psd', file);

        try {
            await axios.post('http://localhost:5001/api/psd/upload', formData);
            await fetchTemplates();
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5001/api/psd/${id}`);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            alert("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-pink-800 font-serif mb-4 capitalize">
                            {params.category.replace('-', ' ')} Templates
                        </h1>
                        <p className="text-gray-600 font-medium">Manage and customize your PSD templates.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className={`
                            px-6 py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2
                            ${uploading ? 'bg-gray-200 text-gray-400' : 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg hover:shadow-pink-200'}
                        `}>
                            {uploading ? 'Uploading...' : 'Upload PSD'}
                            <input
                                type="file"
                                accept=".psd"
                                onChange={handleUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {templates.map(t => (
                            <TemplateCard
                                key={t.id}
                                id={t.id}
                                name={t.name}
                                previewUrl={t.preview}
                                category={t.category}
                                subcategory={t.subcategory}
                                onDelete={handleDelete}
                            />
                        ))}
                        {templates.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium italic">No templates found for this category.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
