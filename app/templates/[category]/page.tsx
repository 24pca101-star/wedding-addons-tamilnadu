import TemplateCard from "@/components/TemplateCard";

export default function PsdTemplatesPage({ params }: { params: { category: string } }) {
    // In a real app, fetch these from an API based on params.category
    const templates = [
        { id: '1', name: 'Elegant Floral', preview: '/storage/previews/floral.png', category: 'ceremony-decor', subcategory: 'welcome-banner' },
        { id: '2', name: 'Gold Modern', preview: '/storage/previews/gold.png', category: 'ceremony-decor', subcategory: 'directional-sign-boards' },
    ];

    return (
        <div className="min-h-screen bg-pink-50/30 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-pink-800 font-serif mb-4 capitalize">
                        {params.category.replace('-', ' ')} Templates
                    </h1>
                    <p className="text-gray-600 font-medium">Choose a PSD template to start customizing for your special day.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {templates.map(t => (
                        <TemplateCard
                            key={t.id}
                            id={t.id}
                            name={t.name}
                            previewUrl={t.preview}
                            category={t.category}
                            subcategory={t.subcategory}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
