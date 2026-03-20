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
            { id: 'ceremony-decor/directional-sign-boards/directional-sign-1.psd', name: 'Classic Wedding Sign', preview: 'ceremony-decor/directional-sign-boards/directional-sign-1.png' },
            { id: 'ceremony-decor/directional-sign-boards/directional-sign-2.psd', name: 'Modern Entrance', preview: 'ceremony-decor/directional-sign-boards/directional-sign-2.png' },
            { id: 'ceremony-decor/directional-sign-boards/directional-sign-3.psd', name: 'Rustic Reception', preview: 'ceremony-decor/directional-sign-boards/directional-sign-3.png' },
            { id: 'ceremony-decor/directional-sign-boards/directional-sign-4.psd', name: 'Grand Ballroom', preview: 'ceremony-decor/directional-sign-boards/directional-sign-4.png' },
            { id: 'ceremony-decor/directional-sign-boards/directional-sign-5.psd', name: 'Elegant Chic Signage', preview: 'ceremony-decor/directional-sign-boards/directional-sign-5.png' },
        ],
        "kolam-entrance-board": [
            { id: 'ceremony-decor/kolam-entrance-board/kolam-1.psd', name: 'Traditional Lotus Kolam', preview: 'ceremony-decor/kolam-entrance-board/kolam-1.png' }
        ]
    },
    "guest-gift-keepsakes": {
        "welcome-tote-bag": [
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-1.psd', name: 'Elegant Floral', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-1.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-2.psd', name: 'Royal Gold', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-2.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-3.psd', name: 'Minimalist Modern', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-3.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-4.psd', name: 'Traditional Ethnic', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-4.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-5.psd', name: 'Boho Eucalyptus', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-5.png' },
        ]
    },
    "traditional-utility-items": {
        "printed-visiri-hand-fan": [
            { id: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-1.psd', name: 'Traditional Floral', preview: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-1.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-2.psd', name: 'Royal Gold Border', preview: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-2.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-3.psd', name: 'Peacock Theme', preview: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-3.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-4.psd', name: 'Vintage Wedding', preview: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-4.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-5.psd', name: 'Modern Rose Bloom', preview: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-5.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-6.psd', name: 'Classic Script', preview: 'traditional-utility-items/printed-visiri-hand-fan/hand-fan-6.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan1-gtfygh.psd', name: 'Custom Hand Fan 1', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan1-gtfygh.png' },
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
