const express = require('express');
const router = express.Router();
const db = require('../config/db');
const supabase = require('../config/supabase');
const multer = require('multer');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT product_id as id, product_name as name, description, price, category_id, stock as stock_quantity, weight_quantity, weight_unit, image_url FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, price, category_id, stock_quantity, weight_quantity, weight_unit } = req.body;
    const file = req.file;
    let imageUrl = null;

    try {
        if (file) {
            const fileName = `items/${Date.now()}_${file.originalname}`;
            const { data, error } = await supabase.storage
                .from('products') // Replace with your actual bucket name
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                });

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        const [result] = await db.query(
            'INSERT INTO products (product_name, description, price, category_id, stock, weight_quantity, weight_unit, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, category_id, stock_quantity, weight_quantity, weight_unit, imageUrl]
        );

        res.status(201).json({ id: result.insertId, name, imageUrl, message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, stock_quantity, weight_quantity, weight_unit } = req.body;

    try {
        await db.query(
            'UPDATE products SET product_name = ?, description = ?, price = ?, category_id = ?, stock = ?, weight_quantity = ?, weight_unit = ? WHERE product_id = ?',
            [name, description, price, category_id, stock_quantity, weight_quantity, weight_unit, id]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE product_id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
