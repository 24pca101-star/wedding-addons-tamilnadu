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
        "directional-sign-boards": [
            { id: 'ceremony-decor/directional-sign-boards/sign-board1 .psd', name: 'Sign Board 1', preview: '/storage/previews/ceremony-decor/directional-sign-boards/sign-board1 72.png' },
            { id: 'ceremony-decor/directional-sign-boards/sign-board2 .psd', name: 'Sign Board 2', preview: '/storage/previews/ceremony-decor/directional-sign-boards/sign-board2 .png' },

            { id: 'ceremony-decor/directional-sign-boards/sign-board3.psd', name: 'Sign Board 3', preview: '/storage/previews/ceremony-decor/directional-sign-boards/sign-board3.png' },

        ],

        "kolam-entrance-board": []
    },
    "guest-gift-keepsakes": {
        "welcome-tote-bag": [
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-1.psd', name: 'Elegant Floral', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-1.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-2.psd', name: 'Royal Gold', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-2.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-3.psd', name: 'Minimalist Modern', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-3.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-4.psd', name: 'Traditional Ethnic', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-4.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-5.psd', name: 'Boho Eucalyptus', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-5.png' },
        ],
        "photo-frame": [
            { id: 'guest-gift-keepsakes/photo-frame/photo frame collection.psd', name: 'Photo Frame Collection', preview: '/storage/previews/guest-gift-keepsakes/photo-frame/photo-frame-collection.png' }
        ]
    },

    "traditional-utility-items": {
        "printed-visiri-hand-fan": [
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan1.psd', name: 'Hand Fan 1', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan1.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan2.psd', name: 'Hand Fan 2', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan2.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan3.psd', name: 'Hand Fan 3', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan3.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan4.psd', name: 'Hand Fan 4', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan4.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan5.psd', name: 'Hand Fan 5', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan5.png' },
        ]

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
