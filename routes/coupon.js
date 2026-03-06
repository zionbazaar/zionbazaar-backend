const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController');

// Admin only routes for managing coupons
router.route('/')
  .post(protect, authorize('admin'), createCoupon)
  .get(protect, authorize('admin'), getCoupons);

router.route('/:id')
  .get(protect, authorize('admin'), getCouponById)
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

// User-facing route to apply a coupon
router.post('/apply', protect, applyCoupon);

module.exports = router;