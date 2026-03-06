const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created successfully', coupon });
  } catch (error) {
    next(error);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

exports.getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    let coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, message: 'Coupon updated successfully', coupon });
  } catch (error) {
    next(error);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    await coupon.deleteOne();
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.applyCoupon = async (req, res, next) => {
    try {
        const { couponCode, totalAmount } = req.body;
        
        if (!couponCode || totalAmount === undefined) {
            return res.status(400).json({ success: false, message: 'Coupon code and total amount are required.' });
        }

        const coupon = await Coupon.findOne({ code: couponCode });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'Coupon is not active.' });
        }

        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return res.status(400).json({ success: false, message: 'Coupon has expired.' });
        }

        if (totalAmount < coupon.minimumAmount) {
            return res.status(400).json({ success: false, message: `Minimum purchase of ${coupon.minimumAmount} required to use this coupon.` });
        }

        let discountedAmount = totalAmount;
        let discountApplied = 0;

        if (coupon.discountType === 'fixed') {
            discountApplied = coupon.discountValue;
            discountedAmount = totalAmount - coupon.discountValue;
        } else if (coupon.discountType === 'percentage') {
            discountApplied = totalAmount * (coupon.discountValue / 100);
            discountedAmount = totalAmount - discountApplied;
        }

        if (discountedAmount < 0) discountedAmount = 0; // Ensure total doesn't go negative

        res.status(200).json({ 
            success: true, 
            message: 'Coupon applied successfully', 
            coupon, 
            discountedAmount: parseFloat(discountedAmount.toFixed(2)),
            discountApplied: parseFloat(discountApplied.toFixed(2))
        });

    } catch (error) {
        next(error);
    }
};