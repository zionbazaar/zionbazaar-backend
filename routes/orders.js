const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
