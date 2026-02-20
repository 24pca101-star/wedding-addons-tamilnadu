export const BACKGROUND_PRESETS = {
    solids: ['#FFFFFF', '#FDFBF7', '#F5F5F5', '#FFF9E3', '#000000', '#800000', '#D4AF37'],
    gradients: [
        { name: 'Luxury Gold', color1: '#BF953F', color2: '#FCF6BA' },
        { name: 'Soft Rose', color1: '#FFF0F5', color2: '#FFD1DC' },
        { name: 'Deep Maroon', color1: '#4A0000', color2: '#800000' },
        { name: 'Cream Silk', color1: '#FFFDD0', color2: '#FDFBF7' }
    ],
    textures: [
        { name: 'Marble', url: '/textures/white-marble.svg' },
        { name: 'Old Paper', url: '/textures/old-paper.svg' },
        { name: 'Linen', url: '/textures/linen.svg' }
    ],
    florals: [
        { name: 'Vintage Corner', url: '/presets/floral-1.svg' },
        { name: 'Gold Laurel', url: '/presets/floral-2.svg' }
    ],
    effects: [
        { id: 'vignette', name: 'Luxe Vignette', class: 'vignette' },
        { id: 'glitter', name: 'Gold Dust', class: 'glitter' },
        { id: 'noise', name: 'Fine Grain', class: 'noise' },
        { id: 'texture-paper', name: 'Raw Paper', class: 'texture-paper' }
    ]
};

export const TEMPLATES = [
    {
        id: 'welcome',
        name: 'Welcome Sign',
        nameTamil: 'வரவேற்பு',
        description: 'Classic welcome board with elegant borders.',
        objects: [
            { type: 'i-text', text: 'Welcome', left: 100, top: 100, fontSize: 80, fontFamily: 'Playfair Display', fill: '#800000' },
            { type: 'i-text', text: 'To the Wedding of', left: 100, top: 200, fontSize: 30, fontFamily: 'Outfit', fill: '#D4AF37' }
        ]
    },
    {
        id: 'reception',
        name: 'Reception',
        nameTamil: 'வரவேற்பு நிகழ்ச்சி',
        description: 'Directional sign for reception hall.',
        objects: [
            { type: 'i-text', text: 'RECEPTION', left: 100, top: 100, fontSize: 60, fontFamily: 'Playfair Display', fill: '#800000', charSpacing: 200 },
            { type: 'i-text', text: '→', left: 400, top: 100, fontSize: 100, fill: '#D4AF37' }
        ]
    },
    {
        id: 'dining',
        name: 'Dining Hall',
        nameTamil: 'உணவு கூடம்',
        description: 'Guide guests to the feast.',
        objects: [
            { type: 'i-text', text: 'DINING HALL', left: 100, top: 100, fontSize: 60, fontFamily: 'Playfair Display', fill: '#800000' },
            { type: 'i-text', text: '←', left: 50, top: 100, fontSize: 100, fill: '#D4AF37' }
        ]
    }
];

export const MOTIFS = [
    { id: 'vinayagar', name: 'Vinayagar', emoji: '🕉️', url: '/assets/motifs/vinayagar.svg' },
    { id: 'peacock', name: 'Peacock', emoji: '🦚', url: '/assets/motifs/peacock.svg' },
    { id: 'leaf-corner', name: 'Leaf Corner', emoji: '🌿', url: '/assets/motifs/leaf-corner.svg' },
    { id: 'gold-frame', name: 'Gold Frame', emoji: '🖼️', url: '/assets/motifs/gold-frame.svg' },
    { id: 'kalash', name: 'Kalash', emoji: '🏺', url: '/assets/motifs/kalash.svg' },
    { id: 'swastik', name: 'Swastika', emoji: '卐', url: '/assets/motifs/swastika.svg' },
    { id: 'om', name: 'Om Symbol', emoji: 'ॐ', url: '/assets/motifs/om.svg' },
    { id: 'christian-cross', name: 'Cross', emoji: '✝️', url: '/assets/motifs/cross.svg' },
    { id: 'wedding-rings', name: 'Rings', emoji: '💍', url: '/assets/motifs/rings.svg' },
    { id: 'love-birds', name: 'Doves', emoji: '🕊️', url: '/assets/motifs/doves.svg' },
    { id: 'heart-lock', name: 'Heart', emoji: '❤️', url: '/assets/motifs/heart.svg' },
    { id: 'rose', name: 'Rose', emoji: '🌹', url: '/assets/motifs/rose.svg' },
    { id: 'lotus', name: 'Lotus', emoji: '🪷', url: '/assets/motifs/lotus.svg' },
    { id: 'champagne', name: 'Cheers', emoji: '🥂', url: '/assets/motifs/cheers.svg' },
    { id: 'couple', name: 'Couple', emoji: '👩‍❤️‍👨', url: '/assets/motifs/couple.svg' },
    { id: 'parking', name: 'Parking', emoji: '🅿️', url: '/assets/motifs/parking.svg' },
    { id: 'dining-icon', name: 'Dining', emoji: '🍽️', url: '/assets/motifs/dining.svg' },
    { id: 'camera-icon', name: 'Photos', emoji: '📸', url: '/assets/motifs/camera.svg' },
    { id: 'gift-box', name: 'Gifts', emoji: '🎁', url: '/assets/motifs/gifts.svg' },
    { id: 'washroom', name: 'Restroom', emoji: '🚻', url: '/assets/motifs/restroom.svg' },
    { id: 'entrance', name: 'Entrance', emoji: '🚪', url: '/assets/motifs/entrance.svg' },
    { id: 'point-left', name: 'Hand Left', emoji: '👈', url: '/assets/motifs/hand-left.svg' },
    { id: 'point-right', name: 'Hand Right', emoji: '👉', url: '/assets/motifs/hand-right.svg' },
    { id: 'lux-arrow-l', name: 'Luxe Arrow L', emoji: '⟸', url: '/assets/motifs/luxe-arrow-l.svg' },
    { id: 'lux-arrow-r', name: 'Luxe Arrow R', emoji: '⟹', url: '/assets/motifs/luxe-arrow-r.svg' },
    { id: 'star', name: 'Star', emoji: '⭐', url: '/assets/motifs/star.svg' }
];
