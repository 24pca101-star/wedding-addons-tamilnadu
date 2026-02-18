const pool = require('../models/db');

// ─── GET /api/templates ───────────────────────────────────────────────────────
// Returns all templates from the database (used by welcome-banner page)
const getAllTemplates = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM templates');
        res.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};

// ─── GET /api/templates/:id ───────────────────────────────────────────────────
// Returns a single template by ID (used by the customize/[id] editor page)
const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM templates WHERE id = ?', [id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Failed to fetch template details' });
    }
};

// ─── GET /api/directional-sign-boards ────────────────────────────────────────
// Returns a hardcoded list of directional sign board templates
// (no DB needed — static data for now)
const getDirectionalSignBoards = (req, res) => {
    const templates = [
        {
            id: 1,
            name: 'Traditional Arrow',
            image: '/templates/traditional-arrow.jpg',
            psd_path: '/templates/traditional-arrow.psd',
            preview: '/templates/traditional-arrow.jpg',
            description: 'Classic arrow sign for traditional wedding venues.',
        },
        {
            id: 2,
            name: 'Floral Direction',
            image: '/templates/floral-board.jpg',
            psd_path: '/templates/floral-board.psd',
            preview: '/templates/floral-board.jpg',
            description: 'Elegant floral design to guide guests with style.',
        },
        {
            id: 3,
            name: 'Modern Minimal',
            image: '/templates/modern-board.jpg',
            psd_path: '/templates/modern-board.psd',
            preview: '/templates/modern-board.jpg',
            description: 'Minimalist board for contemporary wedding themes.',
        },
        {
            id: 4,
            name: 'Rustic Wooden',
            image: '/templates/rustic-board.jpg',
            psd_path: '/templates/rustic-board.psd',
            preview: '/templates/rustic-board.jpg',
            description: 'Rustic wooden sign for outdoor or barn weddings.',
        },
        {
            id: 5,
            name: 'Elegant Gold Frame',
            image: '/templates/gold-frame-sign.jpg',
            psd_path: '/templates/gold-frame-sign.psd',
            preview: '/templates/gold-frame-sign.jpg',
            description: 'Gold-framed sign for a touch of luxury.',
        },
        {
            id: 6,
            name: 'Banana Leaf Traditional',
            image: '/templates/banana-leaf-sign.jpg',
            psd_path: '/templates/banana-leaf-sign.psd',
            preview: '/templates/banana-leaf-sign.jpg',
            description: 'Banana leaf sign for South Indian wedding traditions.',
        },
    ];

    res.json(templates);
};

module.exports = {
    getAllTemplates,
    getTemplateById,
    getDirectionalSignBoards,
};
