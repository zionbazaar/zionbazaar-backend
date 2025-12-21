const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = orderStatus;

        if (orderStatus === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        order = await order.save();

        res.status(200).json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order tracking (admin)
// @route   PUT /api/admin/orders/:id/track
// @access  Private/Admin
exports.updateOrderTracking = async (req, res, next) => {
    try {
        const { trackingNumber, trackingProvider } = req.body;
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.trackingNumber = trackingNumber;
        order.trackingProvider = trackingProvider;
        order.orderStatus = 'Shipped'; // Automatically update status to shipped

        order = await order.save();

        res.status(200).json({ success: true, message: 'Tracking information added', order });
    } catch (error) {
        next(error);
    }
};
