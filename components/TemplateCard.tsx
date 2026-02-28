import Link from 'next/link';
import Image from 'next/image';

interface TemplateCardProps {
    id: string;
    name: string;
    previewUrl: string;
    category: string;
    subcategory: string;
    onDelete?: (id: string) => void;
}

export default function TemplateCard({ id, name, previewUrl, category, subcategory, onDelete }: TemplateCardProps) {
    return (
        <Link
            href={`/editor/${category}/${subcategory}?template=${id}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 block h-fit"
        >
            <div className="relative overflow-hidden bg-gray-50">
                <img
                    src={previewUrl}
                    alt={name}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 block"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between">
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
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xl">→</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
