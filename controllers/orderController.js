const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, orderItems, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentInfo } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ success: false, message: 'No order items' });

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentInfo: paymentMethod === 'RAZORPAY' ? paymentInfo : undefined,
      isPaid: false // isPaid is always false on creation, will be updated by verification
    });

    // Clear cart only after order is successfully created
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalAmount: 0 });

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
    }

    res.status(201).json({ success: true, message: 'Order placed', order });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('orderItems.product', 'name images');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
