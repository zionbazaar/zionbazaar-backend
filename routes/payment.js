const express = require('express');
const router = express.Router();
// Placeholder for future payment routes
const { checkout, paymentVerification } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, checkout);
router.post('/verification', protect, paymentVerification);

module.exports = router;