const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('ERROR:', err);
  if (err.code) console.error('ERROR CODE:', err.code);
  if (err.field) console.error('ERROR FIELD:', err.field);

  // Multer error
  if (err.name === 'MulterError') {
    const message = `Multer Error: ${err.message}${err.field ? ' at field ' + err.field : ''}`;
    error = { message, statusCode: 400 };
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
