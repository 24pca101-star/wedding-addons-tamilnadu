export interface Template {
    id: string;
    name: string;
    preview: string;
}

export const TEMPLATES_REGISTRY: Record<string, Record<string, Template[]>> = {
    "ceremony-decor": {
        "welcome-banner": [
            { id: 'ceremony-decor/welcome-banner/design-1.psd', name: 'Winter Watercolor', preview: '/storage/previews/ceremony-decor/welcome-banner/design-1.png' },
            { id: 'ceremony-decor/welcome-banner/design-2.psd', name: 'Modern Pink Floral', preview: '/storage/previews/ceremony-decor/welcome-banner/design-2.png' },
            { id: 'ceremony-decor/welcome-banner/design-3.psd', name: 'Classic Floral Invite', preview: '/storage/previews/ceremony-decor/welcome-banner/design-3.png' },
            { id: 'ceremony-decor/welcome-banner/design-4.psd', name: 'Vintage Wedding Planner', preview: '/storage/previews/ceremony-decor/welcome-banner/design-4.png' },
            { id: 'ceremony-decor/welcome-banner/design-5.psd', name: 'Elegant Resort Banner', preview: '/storage/previews/ceremony-decor/welcome-banner/design-5.png' },
            { id: 'ceremony-decor/welcome-banner/design-6.psd', name: 'Autumn Watercolor', preview: '/storage/previews/ceremony-decor/welcome-banner/design-6.png' },
            { id: 'ceremony-decor/welcome-banner/design-9.psd', name: 'Royal Wedding Bloom', preview: '/storage/previews/ceremony-decor/welcome-banner/design-9.png' },
            { id: 'ceremony-decor/welcome-banner/design-10.psd', name: 'Royal Garden Bloom', preview: '/storage/previews/ceremony-decor/welcome-banner/design-10.png' },
        ],
        "directional-sign-boards": [
            { id: 'ceremony-decor/directional-sign-boards/sign-board1 .psd', name: 'Sign Board 1', preview: '/storage/previews/ceremony-decor/directional-sign-boards/sign-board1 72.png' },
            { id: 'ceremony-decor/directional-sign-boards/sign-board2 .psd', name: 'Sign Board 2', preview: '/storage/previews/ceremony-decor/directional-sign-boards/sign-board2 .png' },

            { id: 'ceremony-decor/directional-sign-boards/sign-board3.psd', name: 'Sign Board 3', preview: '/storage/previews/ceremony-decor/directional-sign-boards/sign-board3.png' },

        ],
        "kolam-entrance-board": [
            { id: 'ceremony-decor/kolam-entrance-board/Kolam.psd', name: 'Kolam', preview: '/storage/previews/ceremony-decor/kolam-entrance-board/kolam.png' },
            { id: 'ceremony-decor/kolam-entrance-board/kolam-design-1.psd', name: 'Royal Garden', preview: '/storage/previews/ceremony-decor/kolam-entrance-board/kolam-design-1.png' },
            { id: 'ceremony-decor/kolam-entrance-board/kolam-design-2.psd', name: 'Golden Swirl', preview: '/storage/previews/ceremony-decor/kolam-entrance-board/kolam-design-2.png' },
            { id: 'ceremony-decor/kolam-entrance-board/kolam-design-3.psd', name: 'Floral Bloom', preview: '/storage/previews/ceremony-decor/kolam-entrance-board/kolam-design-3.png' },
        ],
        "temple-theme-stage-backdrop": [
            { id: 'ceremony-decor/temple-theme-stage-backdrop/Stage.psd', name: 'Stage', preview: '/storage/previews/ceremony-decor/temple-theme-stage-backdrop/stage.png' },
            { id: 'ceremony-decor/temple-theme-stage-backdrop/stage-theme-1.psd', name: 'Traditional Temple Stage', preview: '/storage/previews/ceremony-decor/temple-theme-stage-backdrop/stage-theme-1.png' },
        ]
    },
    "guest-gift-keepsakes": {
        "welcome-tote-bag": [
            { id: 'guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-1.psd', name: 'Elegant Floral', preview: '/storage/previews/guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-1.png' },
            { id: 'guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-2.psd', name: 'Royal Gold', preview: '/storage/previews/guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-2.png' },
            { id: 'guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-3.psd', name: 'Minimalist Modern', preview: '/storage/previews/guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-3.png' },
            { id: 'guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-4.psd', name: 'Traditional Ethnic', preview: '/storage/previews/guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-4.png' },
            { id: 'guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-5.psd', name: 'Boho Eucalyptus', preview: '/storage/previews/guest-gift-keepsakes/welcome-tote-bag/tote-bag-design-5.png' },
        ],
        "water-bottle-label": [
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-1.psd', name: 'Royal Garden', preview: '/storage/previews/guest-gift-keepsakes/water-bottle-label/bottle-label-1.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-2.psd', name: 'Golden Swirl', preview: '/storage/previews/guest-gift-keepsakes/water-bottle-label/bottle-label-2.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-3.psd', name: 'Floral Bloom', preview: '/storage/previews/guest-gift-keepsakes/water-bottle-label/bottle-label-3.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-4.psd', name: 'Modern Abstract', preview: '/storage/previews/guest-gift-keepsakes/water-bottle-label/bottle-label-4.png' },
            { id: 'guest-gift-keepsakes/water-bottle-label/bottle-label-5.psd', name: 'Vintage Lace', preview: '/storage/previews/guest-gift-keepsakes/water-bottle-label/bottle-label-5.png' },
        ],
        "fridge-magnet": [
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-1.psd', name: 'Traditional Pattern', preview: '/storage/previews/guest-gift-keepsakes/fridge-magnet/fridge-magnet-1.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-2.psd', name: 'Royal Border', preview: '/storage/previews/guest-gift-keepsakes/fridge-magnet/fridge-magnet-2.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-3.psd', name: 'Floral Delight', preview: '/storage/previews/guest-gift-keepsakes/fridge-magnet/fridge-magnet-3.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-4.psd', name: 'Classic Elegance', preview: '/storage/previews/guest-gift-keepsakes/fridge-magnet/fridge-magnet-4.png' },
            { id: 'guest-gift-keepsakes/fridge-magnet/fridge-magnet-5.psd', name: 'Artistic Bloom', preview: '/storage/previews/guest-gift-keepsakes/fridge-magnet/fridge-magnet-5.png' },
        ],
        "photo-frame": [
            { id: 'guest-gift-keepsakes/photo-frame/photo-frame-1.psd', name: 'Classic Photo Frame 1', preview: '/storage/previews/guest-gift-keepsakes/photo-frame/photo-frame-1.png' },
            { id: 'guest-gift-keepsakes/photo-frame/photo-frame-2.psd', name: 'Elegant Photo Frame 2', preview: '/storage/previews/guest-gift-keepsakes/photo-frame/photo-frame-2.png' },
            { id: 'guest-gift-keepsakes/photo-frame/photo-frame-3.psd', name: 'Traditional Photo Frame 3', preview: '/storage/previews/guest-gift-keepsakes/photo-frame/photo-frame-3.png' },
        ],
        "mini-calendar": [
            { id: 'guest-gift-keepsakes/mini-calendar/Mini Calendar.psd', name: 'Mini Calendar', preview: '/storage/previews/guest-gift-keepsakes/mini-calendar/mini-calendar.png' },
            { id: 'guest-gift-keepsakes/mini-calendar/mini-calendar-1.psd', name: 'Mini Calendar 1', preview: '/storage/previews/guest-gift-keepsakes/mini-calendar/mini-calendar-1.png' },
            { id: 'guest-gift-keepsakes/mini-calendar/mini-calendar-2.psd', name: 'Mini Calendar 2', preview: '/storage/previews/guest-gift-keepsakes/mini-calendar/mini-calendar-2.png' },
        ]
    },

    "traditional-utility-items": {
        "printed-visiri-hand-fan": [
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan1.psd', name: 'Hand Fan 1', preview: '/storage/previews/traditional-utility-items/printed-visiri-hand-fan/handfan1.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan2.psd', name: 'Hand Fan 2', preview: '/storage/previews/traditional-utility-items/printed-visiri-hand-fan/handfan2.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan3.psd', name: 'Hand Fan 3', preview: '/storage/previews/traditional-utility-items/printed-visiri-hand-fan/handfan3.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan4.psd', name: 'Hand Fan 4', preview: '/storage/previews/traditional-utility-items/printed-visiri-hand-fan/handfan4.png' },
            { id: 'traditional-utility-items/printed-visiri-hand-fan/handfan5.psd', name: 'Hand Fan 5', preview: '/storage/previews/traditional-utility-items/printed-visiri-hand-fan/handfan5.png' },
        ],
        "traditional-umbrella-parasol": [
            { id: 'traditional-utility-items/traditional-umbrella-parasol/umberlla-3.psd', name: 'Traditional Umbrella', preview: '/storage/previews/traditional-utility-items/traditional-umbrella-parasol/umbrella-3.png' },
            { id: 'traditional-utility-items/traditional-umbrella-parasol/umbrella-1.psd', name: 'Royal Garden', preview: '/storage/previews/traditional-utility-items/traditional-umbrella-parasol/umbrella-1.png' },
            { id: 'traditional-utility-items/traditional-umbrella-parasol/umberlla2.psd', name: 'Golden Swirl', preview: '/storage/previews/traditional-utility-items/traditional-umbrella-parasol/umbrella-2.png' },
        ],

    },
    "apparel-wearables": {
        "bride-groom-t-shirts": [
            { id: 'apparel-wearables/bride-groom-t-shirts/bride-t-shirt.psd', name: 'Bride T-Shirt', preview: '/storage/previews/apparel-wearables/bride-groom-t-shirts/bride-t-shirt.png' },
            { id: 'apparel-wearables/bride-groom-t-shirts/groom-t-shirt.psd', name: 'Groom T-Shirt', preview: '/storage/previews/apparel-wearables/bride-groom-t-shirts/groom-t-shirt.png' },
        ],
        "team-bride-t-shirts": [
            { id: 'apparel-wearables/team-bride-t-shirts/team-bride-t-shirt.psd', name: 'Team Bride T-Shirt', preview: '/storage/previews/apparel-wearables/team-bride-t-shirts/team-bride-t-shirt.png' },
        ],
        "team-groom-t-shirts": [
            { id: 'apparel-wearables/team-groom-t-shirts/team-groom-t-shirt.psd', name: 'Team Groom T-Shirt', preview: '/storage/previews/apparel-wearables/team-groom-t-shirts/team-groom-t-shirt.png' },
        ],
        "customized-shirts-kurtas": [
            { id: 'apparel-wearables/customized-shirts-kurtas/custom-shirt.psd', name: 'Custom Shirt', preview: '/storage/previews/apparel-wearables/customized-shirts-kurtas/custom-shirt.png' },
            { id: 'apparel-wearables/customized-shirts-kurtas/custom-kurti.psd', name: 'Custom Kurti', preview: '/storage/previews/apparel-wearables/customized-shirts-kurtas/custom-kurti.png' },
        ]
    },
    "ritual-essentials": {
        "ritual-name-boards": [
            { id: 'ritual-essentials/ritual-name-boards/sangeet-ritual-board-1.psd', name: 'Sangeet Ritual Board', preview: '/storage/previews/ritual-essentials/ritual-name-boards/sangeet-ritual-board-1.png' },
            { id: 'ritual-essentials/ritual-name-boards/haldi-ritual-board-2.psd', name: 'Haldi Ritual Board', preview: '/storage/previews/ritual-essentials/ritual-name-boards/haldi-ritual-board-2.png' },
            { id: 'ritual-essentials/ritual-name-boards/wedding-ritual-board-3.psd', name: 'Wedding Ritual Board', preview: '/storage/previews/ritual-essentials/ritual-name-boards/wedding-ritual-board-3.png' },
            { id: 'ritual-essentials/ritual-name-boards/ring-ritual-board-4.psd', name: 'Ring Ritual Board', preview: '/storage/previews/ritual-essentials/ritual-name-boards/ring-ritual-board-4.png' },
        ],
        "pooja-kit-bag": [
            { id: 'ritual-essentials/pooja-kit-bag/pooja-bag-1.psd', name: 'Traditional Pooja Bag 1', preview: '/storage/previews/ritual-essentials/pooja-kit-bag/pooja-bag-1.png' },
            { id: 'ritual-essentials/pooja-kit-bag/pooja-bag-2.psd', name: 'Floral Pooja Bag 2', preview: '/storage/previews/ritual-essentials/pooja-kit-bag/pooja-bag-2.png' },
        ]
    },
    "photo-fun-props": {
        "traditional-photo-props": [
            { id: 'photo-fun-props/traditional-photo-props/Cap.psd', name: 'Cap', preview: '/storage/previews/photo-fun-props/traditional-photo-props/cap.png' },
            { id: 'photo-fun-props/traditional-photo-props/Glass.psd', name: 'Glass', preview: '/storage/previews/photo-fun-props/traditional-photo-props/glass.png' },
            { id: 'photo-fun-props/traditional-photo-props/Mask.psd', name: 'Mask', preview: '/storage/previews/photo-fun-props/traditional-photo-props/mask.png' },
            { id: 'photo-fun-props/traditional-photo-props/Rippon.psd', name: 'Rippon', preview: '/storage/previews/photo-fun-props/traditional-photo-props/rippon.png' },
            { id: 'photo-fun-props/traditional-photo-props/photo frame collection.psd', name: 'Photo Frame Collection', preview: '/storage/previews/photo-fun-props/traditional-photo-props/photo-frame-collection.png' },
        ],
        "selfie-frame": [
            { id: 'photo-fun-props/selfie-frame/Selfi Booth.psd', name: 'Selfie Booth', preview: '/storage/previews/photo-fun-props/selfie-frame/selfie-booth.png' },
        ]
    }
};

export const getTemplates = (category: string, subcategory: string): Template[] => {
    return TEMPLATES_REGISTRY[category]?.[subcategory] || [];
};
