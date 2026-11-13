const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, seedProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/seed/run', (req, res) => res.status(405).json({ message: 'Use POST /api/products/seed/run' }));
router.post('/seed/run', seedProducts);
router.post('/', createProduct);
router.get('/:slug', getProduct);

module.exports = router;
