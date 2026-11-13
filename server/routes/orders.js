const express = require('express');
const router = express.Router();
const { createOrder, syncOrders, getOrders } = require('../controllers/orderController');

router.get('/', getOrders);
router.post('/', createOrder);
router.post('/sync', syncOrders);

module.exports = router;
