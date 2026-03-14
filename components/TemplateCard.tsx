import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface TemplateCardProps {
    id: string;
    name: string;
    previewUrl: string;
    category: string;
    subcategory: string;
    onDelete?: (id: string) => void;
}

export default function TemplateCard({ id, name, previewUrl, category, subcategory, onDelete }: TemplateCardProps) {
    const [imgError, setImgError] = useState(false);

    const getTemplateColors = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('rose') || lowerName.includes('pink') || lowerName.includes('heart')) {
            return { bg: 'from-pink-100 to-rose-50', text: 'text-pink-400' };
        }
        if (lowerName.includes('gold') || lowerName.includes('royal') || lowerName.includes('premium')) {
            return { bg: 'from-amber-100 to-yellow-50', text: 'text-amber-500' };
        }
        if (lowerName.includes('winter') || lowerName.includes('water') || lowerName.includes('blue')) {
            return { bg: 'from-blue-100 to-cyan-50', text: 'text-blue-400' };
        }
        if (lowerName.includes('yellow')) {
            return { bg: 'from-yellow-100 to-orange-50', text: 'text-yellow-500' };
        }
        if (lowerName.includes('traditional') || lowerName.includes('classic')) {
            return { bg: 'from-red-100 to-orange-50', text: 'text-red-400' };
        }
        if (lowerName.includes('modern') || lowerName.includes('elegant') || lowerName.includes('artistic')) {
            return { bg: 'from-purple-100 to-indigo-50', text: 'text-purple-400' };
        }
        return { bg: 'from-gray-100 to-slate-50', text: 'text-gray-400' };
    };

    const colors = getTemplateColors(name);

    return (
        <Link
            href={`/editor/${category}/${subcategory}?template=${id}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 block h-full flex flex-col"
        >
            <div className={`relative overflow-hidden aspect-[3/2] flex items-center justify-center bg-gradient-to-br ${colors.bg}`}>
                {!imgError && previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt={name}
                        className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-500 p-2"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className={`text-5xl font-bold ${colors.text} transform group-hover:scale-110 transition-transform duration-500 opacity-80`}>
                        {name.charAt(0).toUpperCase()}
                    </span>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between mt-auto">
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-gray-800 truncate">{name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{subcategory}</p>
                </div>
                <div className="flex items-center gap-2">
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete ${name}?`)) {
                                    onDelete(id);
                                }
                            }}
                            className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                            title="Delete Template"
                        >
                            <span className="text-lg">×</span>
                        </button>
                    )}
                    <div className={`w-8 h-8 rounded-full bg-opacity-20 flex items-center justify-center ${colors.text.replace('text-', 'bg-')} ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span className="text-xl">→</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
