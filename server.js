const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();


// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin'); // New admin routes
const paymentRoutes = require('./routes/payment');
const uploadRoutes = require('./routes/upload');

// Import DB Connection
const connectDB = require('./config/db');

const configureCloudinary = require('./config/cloudinary');

// Import Error Handler
const errorHandler = require('./middleware/errorHandler');

// Configure Cloudinary
configureCloudinary();

// Connect to Database
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
// API Routes (Must come before catch-all)
// ---------------------------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes); // Register new admin routes
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

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


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ZionBazaar Backend API is running 🚀'
  });
});


// ---------------------------
// Start Server
// ---------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;   
