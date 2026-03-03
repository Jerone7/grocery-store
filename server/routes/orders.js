const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all orders with user details
router.get('/', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT 
                o.order_id, 
                o.user_id, 
                o.total_amount, 
                o.status, 
                o.order_date,
                o.payment_details,
                u.name as customer_name,
                u.email as customer_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            ORDER BY o.order_date DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get detailed order items for a specific order
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [items] = await db.query(`
            SELECT 
                oi.order_item_id,
                oi.quantity,
                oi.price,
                p.product_name,
                p.image_url,
                p.weight_quantity,
                p.weight_unit
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        `, [id]);

        res.json(items);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        await db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, id]);
        res.json({ message: 'Order status updated successfully', order_id: id, status });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
