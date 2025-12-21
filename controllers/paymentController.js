const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// @desc    Create Razorpay Order
// @route   POST /api/payment/checkout
// @access  Private
exports.checkout = async (req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Number(req.body.amount * 100), // amount in the smallest currency unit
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: 'Razorpay order creation failed' });
        }

        res.status(200).json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verification
// @access  Private
exports.paymentVerification = async (req, res, next) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        // Find the order by our internal MongoDB _id first
        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify the Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update the order with payment details and mark as paid
            order.paymentInfo.razorpay_order_id = razorpay_order_id;
            order.paymentInfo.razorpay_payment_id = razorpay_payment_id;
            order.paymentInfo.razorpay_signature = razorpay_signature;
            order.isPaid = true;
            order.paidAt = Date.now();

            await order.save();
            
            res.status(200).json({
              success: true,
              message: "Payment successful",
              orderId: order._id,
              paymentId: razorpay_payment_id
            });

        } else {
            // Optionally, update order status to 'Payment Failed' or similar
            // order.orderStatus = 'Cancelled'; // Or a new status like 'Payment Failed'
            // await order.save();
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        next(error);
    }
};