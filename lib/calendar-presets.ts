export const CALENDAR_SIZES = [
    {
        id: 'pocket',
        name: 'Pocket Card',
        dimensions: '85 × 54 mm',
        width: 85,
        height: 54,
        description: 'Compact card that fits perfectly in any wallet.'
    },
    {
        id: 'mini-rect',
        name: 'Mini Rectangle',
        dimensions: '90 × 50 mm',
        width: 90,
        height: 50,
        description: 'Elegant slim format for modern mini calendars.'
    },
    {
        id: 'mini-square',
        name: 'Mini Square',
        dimensions: '70 × 70 mm',
        width: 70,
        height: 70,
        description: 'Minimalist square design for a sleek look.'
    },
    {
        id: 'mini-rect-large',
        name: 'Mini Rectangle Large',
        dimensions: '100 × 70 mm',
        width: 100,
        height: 70,
        description: 'Extra space for larger photos and details.'
    },
    {
        id: 'desk-stand',
        name: 'Mini Desk Stand',
        dimensions: '120 × 90 mm',
        width: 120,
        height: 90,
        description: 'Ideal size for small desktop display calendars.'
    },
    {
        id: 'magnetic',
        name: 'Magnetic Mini',
        dimensions: '90 × 50 mm',
        width: 90,
        height: 50,
        description: 'Perfect for refrigerators and magnetic boards.'
    },
    {
        id: 'folded',
        name: 'Folded Mini',
        dimensions: '90 × 180 mm',
        width: 90,
        height: 180,
        foldedWidth: 90,
        foldedHeight: 90,
        description: 'Two-sided folded card (90x90 folded size).'
    }
];

export const CALENDAR_MOTIFS = [
    { id: 'rings', name: 'Rings', emoji: '💍' },
    { id: 'flowers', name: 'Flowers', emoji: '🌸' },
    { id: 'temple', name: 'Temple', emoji: '🛕' },
    { id: 'om', name: 'Om Symbol', emoji: '🕉️' },
    { id: 'kalash', name: 'Kalash', emoji: '🏺' },
    { id: 'vinayagar', name: 'Vinayagar', emoji: '🐘' },
    { id: 'heart', name: 'Heart', emoji: '❤️' },
    { id: 'dove', name: 'Dove', emoji: '🕊️' },
    { id: 'star', name: 'Star', emoji: '⭐' },
    { id: 'sparkles', name: 'Sparkles', emoji: '✨' },
    { id: 'peacock', name: 'Peacock', emoji: '🦚' },
    { id: 'lotus', name: 'Lotus', emoji: '🪷' },
];

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
