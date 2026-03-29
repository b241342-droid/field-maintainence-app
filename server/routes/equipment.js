const express = require('express');
const db = require('../db');
const { verifyToken, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// GET /api/equipment
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM equipment ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/equipment
router.post('/', restrictTo('admin'), async (req, res) => {
    const { name, location, status, last_serviced } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO equipment (name, location, status, last_serviced) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, location, status || 'operational', last_serviced]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/equipment/:id
router.put('/:id', restrictTo('admin', 'supervisor'), async (req, res) => {
    const { id } = req.params;
    const { status, last_serviced } = req.body;
    try {
        let query = 'UPDATE equipment SET ';
        const values = [];
        let index = 1;

        if (status) {
            query += `status = $${index++} `;
            values.push(status);
        }
        if (last_serviced) {
            if (status) query += ', ';
            query += `last_serviced = $${index++} `;
            values.push(last_serviced);
        }

        // if no valid fields provided
        if (values.length === 0) {
           return res.status(400).json({ message: 'No valid fields provided to update.' });
        }

        query += `WHERE id = $${index++} RETURNING *`;
        values.push(id);

        const result = await db.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
