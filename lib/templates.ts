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
            { id: 'ceremony-decor/kolam-entrance-board/kolam-design-1.psd', name: 'Royal Garden', preview: 'ceremony-decor/kolam-entrance-board/kolam-design-1.png' },
            { id: 'ceremony-decor/kolam-entrance-board/kolam-design-2.psd', name: 'Golden Swirl', preview: 'ceremony-decor/kolam-entrance-board/kolam-design-2.png' },
            { id: 'ceremony-decor/kolam-entrance-board/kolam-design-3.psd', name: 'Floral Bloom', preview: 'ceremony-decor/kolam-entrance-board/kolam-design-3.png' },
        ],
        "temple-theme-stage-backdrop": [
            { id: 'ceremony-decor/temple-theme-stage-backdrop/stage-theme-1.psd', name: 'Traditional Temple Stage', preview: 'ceremony-decor/temple-theme-stage-backdrop/stage-theme-1.png' },
        ]
    },
    "guest-gift-keepsakes": {
        "welcome-tote-bag": [
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-1.psd', name: 'Elegant Floral', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-1.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-2.psd', name: 'Royal Gold', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-2.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-3.psd', name: 'Minimalist Modern', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-3.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-4.psd', name: 'Traditional Ethnic', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-4.png' },
            { id: 'guest-gift-keepsakes/tote-bag/tote-bag-design-5.psd', name: 'Boho Eucalyptus', preview: 'guest-gift-keepsakes/tote-bag/tote-bag-design-5.png' },
        ],
        "water-bottle-label": [
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-1.psd', name: 'Royal Garden', preview: 'guest-gift-keepsakes/water-bottle-label/bottle-label-1.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-2.psd', name: 'Golden Swirl', preview: 'guest-gift-keepsakes/water-bottle-label/bottle-label-2.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-3.psd', name: 'Floral Bloom', preview: 'guest-gift-keepsakes/water-bottle-label/bottle-label-3.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-4.psd', name: 'Modern Abstract', preview: 'guest-gift-keepsakes/water-bottle-label/bottle-label-4.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-5.psd', name: 'Vintage Lace', preview: 'guest-gift-keepsakes/water-bottle-label/bottle-label-5.png' },
        ],
        "fridge-magnet": [
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-1.psd', name: 'Traditional Pattern', preview: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-1.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-2.psd', name: 'Royal Border', preview: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-2.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-3.psd', name: 'Floral Delight', preview: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-3.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-4.psd', name: 'Classic Elegance', preview: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-4.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-5.psd', name: 'Artistic Bloom', preview: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-5.png' },
        ],
        "photo-frame": [
            { id: 'guest-gift-keepsakes/photo-frame/photo-frame-1.psd', name: 'Classic Photo Frame 1', preview: 'guest-gift-keepsakes/photo-frame/photo-frame-1.png' },
            { id: 'guest-gift-keepsakes/photo-frame/photo-frame-2.psd', name: 'Elegant Photo Frame 2', preview: 'guest-gift-keepsakes/photo-frame/photo-frame-2.png' },
            { id: 'guest-gift-keepsakes/photo-frame/photo-frame-3.psd', name: 'Traditional Photo Frame 3', preview: 'guest-gift-keepsakes/photo-frame/photo-frame-3.png' },
        ]
    },
    "traditional-utility-items": {
        "printed-visiri-hand-fan": [
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan-design-1.psd', name: 'Traditional Hand Fan', preview: 'traditional-utility-items/printed-visiri-hand-fan/handfan-design-1.png' },
        ],
        "traditional-umbrella-parasol": [
            { id: 'traditional-utility-items/traditional-umbrella-parasol/umbrella-1.psd', name: 'Royal Garden', preview: 'traditional-utility-items/traditional-umbrella-parasol/umbrella-1.png' },
            { id: 'traditional-utility-items/traditional-umbrella-parasol/umberlla-2.psd', name: 'Golden Swirl', preview: 'traditional-utility-items/traditional-umbrella-parasol/umberlla-2.png' },
        ]
    },
    "apparel-wearables": {
        "bride-groom-t-shirts": [
            { id: 'apparel-wearables/bride-groom-t-shirts/bride-t-shirt.psd', name: 'Bride T-Shirt', preview: 'apparel-wearables/bride-groom-t-shirts/bride-t-shirt.png' },
            { id: 'apparel-wearables/bride-groom-t-shirts/groom-t-shirt.psd', name: 'Groom T-Shirt', preview: 'apparel-wearables/bride-groom-t-shirts/groom-t-shirt.png' },
        ],
        "team-bride-t-shirts": [
            { id: 'apparel-wearables/team-bride-t-shirts/team-bride-t-shirt.psd', name: 'Team Bride T-Shirt', preview: 'apparel-wearables/team-bride-t-shirts/team-bride-t-shirt.png' },
        ],
        "team-groom-t-shirts": [
            { id: 'apparel-wearables/team-groom-t-shirts/team-groom-t-shirt.psd', name: 'Team Groom T-Shirt', preview: 'apparel-wearables/team-groom-t-shirts/team-groom-t-shirt.png' },
        ],
        "customized-shirts-kurtas": [
            { id: 'apparel-wearables/customized-shirts-kurtas/custom-shirt.psd', name: 'Custom Shirt', preview: 'apparel-wearables/customized-shirts-kurtas/custom-shirt.png' },
            { id: 'apparel-wearables/customized-shirts-kurtas/custom-kurti.psd', name: 'Custom Kurti', preview: 'apparel-wearables/customized-shirts-kurtas/custom-kurti.png' },
        ]
    },
    "ritual-essentials": {
        "ritual-name-boards": [
            { id: 'ritual-essentials/ritual-name-boards/sangeet-ritual-board-1.psd', name: 'Sangeet Ritual Board', preview: 'ritual-essentials/ritual-name-boards/sangeet-ritual-board-1.png' },
            { id: 'ritual-essentials/ritual-name-boards/haldi-ritual-board-2.psd', name: 'Haldi Ritual Board', preview: 'ritual-essentials/ritual-name-boards/haldi-ritual-board-2.png' },
            { id: 'ritual-essentials/ritual-name-boards/wedding-ritual-board-3.psd', name: 'Wedding Ritual Board', preview: 'ritual-essentials/ritual-name-boards/wedding-ritual-board-3.png' },
            { id: 'ritual-essentials/ritual-name-boards/ring-ritual-board-4.psd', name: 'Ring Ritual Board', preview: 'ritual-essentials/ritual-name-boards/ring-ritual-board-4.png' },
        ],
        "pooja-kit-bag": [
            { id: 'ritual-essentials/pooja-kit-bag/pooja-bag-1.psd', name: 'Traditional Pooja Bag 1', preview: 'ritual-essentials/pooja-kit-bag/pooja-bag-1.png' },
            { id: 'ritual-essentials/pooja-kit-bag/pooja-bag-2.psd', name: 'Floral Pooja Bag 2', preview: 'ritual-essentials/pooja-kit-bag/pooja-bag-2.png' },
        ]
    }
};

export const getTemplates = (category: string, subcategory: string): Template[] => {
    return TEMPLATES_REGISTRY[category]?.[subcategory] || [];
};
