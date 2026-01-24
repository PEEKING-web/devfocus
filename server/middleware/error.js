const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console for developer
  console.error('Error:', err);

  // Mongoose bad ObjectId (invalid ID format)
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404,
    };
  }

  // Mongoose duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = {
      message,
      statusCode: 400,
    };
  }

  // Mongoose validation error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = {
      message,
      statusCode: 400,
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please login again.';
    error = {
      message,
      statusCode: 401,
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please login again.';
    error = {
      message,
      statusCode: 401,
    };
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;