const express = require('express');
const db = require('../db');
const { verifyToken, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// GET /api/work-orders
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT wo.*, e.name as equipment_name, u.name as assigned_name FROM work_orders wo LEFT JOIN equipment e ON wo.equipment_id = e.id LEFT JOIN users u ON wo.assigned_to = u.id';
        let values = [];

        if (req.user.role === 'engineer') {
            query += ' WHERE wo.assigned_to = $1';
            values.push(req.user.id);
        }
        query += ' ORDER BY wo.created_at DESC';

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/work-orders
router.post('/', async (req, res) => {
    const { title, description, priority, equipment_id, assigned_to } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO work_orders (title, description, priority, equipment_id, assigned_to, created_by) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description, priority || 'medium', equipment_id, assigned_to, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/work-orders/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, assigned_to } = req.body;
    try {
        let query = 'UPDATE work_orders SET updated_at = CURRENT_TIMESTAMP';
        const values = [];
        let index = 1;

        if (status) {
            query += `, status = $${index++}`;
            values.push(status);
        }
        // Only allow admin and supervisor to re-assign work orders
        if (assigned_to && ['admin', 'supervisor'].includes(req.user.role)) {
            query += `, assigned_to = $${index++}`;
            values.push(assigned_to);
        }

        query += ` WHERE id = $${index++} RETURNING *`;
        values.push(id);

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            // Log activity
            if (status) {
                await db.query(
                    'INSERT INTO activity_log (work_order_id, user_id, action) VALUES ($1, $2, $3)',
                    [id, req.user.id, `Updated status to ${status}`]
                );
            }
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/work-orders/:id
router.delete('/:id', restrictTo('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM work_orders WHERE id = $1', [id]);
        res.json({ message: 'Work order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
