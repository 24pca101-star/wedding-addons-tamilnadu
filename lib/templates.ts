export interface Template {
    id: string;
    name: string;
    preview: string;
}

export const TEMPLATES_REGISTRY: Record<string, Record<string, Template[]>> = {
    "ceremony-decor": {
        "welcome-banner": [
            { id: 'ceremony-decor/welcome-banner/design-1.psd', name: 'Winter Watercolor', preview: 'ceremony-decor/welcome-banner/design-1.png' },
            { id: 'ceremony-decor/welcome-banner/design-2.psd', name: 'Modern Pink Floral', preview: 'ceremony-decor/welcome-banner/design-2.png' },
            { id: 'ceremony-decor/welcome-banner/design-3.psd', name: 'Classic Floral Invite', preview: 'ceremony-decor/welcome-banner/design-3.png' },
            { id: 'ceremony-decor/welcome-banner/design-4.psd', name: 'Vintage Wedding Planner', preview: 'ceremony-decor/welcome-banner/design-4.png' },
            { id: 'ceremony-decor/welcome-banner/design-5.psd', name: 'Elegant Resort Banner', preview: 'ceremony-decor/welcome-banner/design-5.png' },
            { id: 'ceremony-decor/welcome-banner/design-6.psd', name: 'Autumn Watercolor', preview: 'ceremony-decor/welcome-banner/design-6.png' },
            { id: 'ceremony-decor/welcome-banner/design-9.psd', name: 'Royal Wedding Bloom', preview: 'ceremony-decor/welcome-banner/design-9.png' },
            { id: 'ceremony-decor/welcome-banner/design-10.psd', name: 'Royal Garden Bloom', preview: 'ceremony-decor/welcome-banner/design-10.png' },
        ],
        "directional-sign-boards": []
    },
    "guest-gift-keepsakes": {
        "welcome-tote-bag": []
    },
    "traditional-utility-items": {
        "printed-visiri-hand-fan": []
    },
    "apparel-wearables": {
        "bride-groom-t-shirts": [
            { id: 'apparel-wearables/bride-groom-t-shirts/design-1.psd', name: 'Groom Squad Tee', preview: 'apparel-wearables/bride-groom-t-shirts/design-1.png' },
        ]
    }
};

export const getTemplates = (category: string, subcategory: string): Template[] => {
    return TEMPLATES_REGISTRY[category]?.[subcategory] || [];
};
