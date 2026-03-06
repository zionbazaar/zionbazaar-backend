const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import DB Connection & Config
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const uploadRoutes = require('./routes/upload');
const wishlistRoutes = require('./routes/wishlist');
const couponRoutes = require('./routes/coupon');
const chatbotRoutes = require('./routes/chatbot');

// Import Error Handler
const errorHandler = require('./middleware/errorHandler');

// Initialize Configs
configureCloudinary();
connectDB();

// Initialize Express App
const app = express();

// ---------------------------
// Security Middlewares
// ---------------------------
app.use(helmet());
app.use(cors());

// ---------------------------
// Rate Limiting
// ---------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ---------------------------
// Body Parsers
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// Logging
// ---------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------------------------
// Serve Backend Public Files
// ---------------------------
app.use('/public', express.static(path.join(__dirname, 'public')));

// ---------------------------
// API Routes
// ---------------------------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/chatbot', chatbotRoutes);

// ---------------------------
// Root Route
// ---------------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ZionBazaar Backend API is running 🚀'
  });
});

// ---------------------------
// 404 for API Routes
// ---------------------------
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// ---------------------------
// Error Handling Middleware
// ---------------------------
app.use(errorHandler);

// ---------------------------
// Start Server
// ---------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
