const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { getRepairSuggestion } = require('../services/geminiService');

const router = express.Router();

router.use(verifyToken);

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
    const { description, equipmentType } = req.body;
    if (!description || !equipmentType) {
        return res.status(400).json({ message: 'description and equipmentType are required' });
    }

    try {
        const suggestion = await getRepairSuggestion(description, equipmentType);
        res.json({ suggestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
