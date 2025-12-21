const express = require('express');
const router = express.Router();
const { getProducts, getOrders, getUsers, updateOrderStatus, updateOrderTracking } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes in this file are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/products', getProducts);
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);
router.put('/orders/:id/track', updateOrderTracking);
router.get('/users', getUsers);

module.exports = router;
