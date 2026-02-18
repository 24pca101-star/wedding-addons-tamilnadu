const express = require('express');
const router = express.Router();
const {
    getAllTemplates,
    getTemplateById,
    getDirectionalSignBoards,
} = require('../controllers/addonsController');

// GET /api/templates
// Returns all templates from the database
router.get('/templates', getAllTemplates);

// GET /api/templates/:id
// Returns a single template by its ID
router.get('/templates/:id', getTemplateById);

// GET /api/directional-sign-boards
// Returns the list of directional sign board templates
router.get('/directional-sign-boards', getDirectionalSignBoards);

module.exports = router;
