import Link from 'next/link';
import Image from 'next/image';

interface TemplateCardProps {
    id: string;
    name: string;
    previewUrl: string;
    category: string;
    subcategory: string;
}

export default function TemplateCard({ id, name, previewUrl, category, subcategory }: TemplateCardProps) {
    return (
        <Link
            href={`/${category}/${subcategory}/editor?template=${id}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <Image
                    src={previewUrl}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">{name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{subcategory}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 scale-0 group-hover:scale-100 transition-transform">
                    <span className="text-xl">→</span>
                </div>
            </div>
        </Link>
    );
}
