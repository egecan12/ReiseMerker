const mongoose = require('mongoose');

// Helper functions for responses
const sendErrorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message
  };
  
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }
  
  res.status(statusCode).json(response);
};

const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    source: isUsingMemory() ? 'memory' : 'mongodb'
  });
};

// Database connection helper
let useInMemory = false;

const isUsingMemory = () => useInMemory || mongoose.connection.readyState !== 1;

const setUseInMemory = (value) => {
  useInMemory = value;
};

module.exports = {
  sendErrorResponse,
  sendSuccessResponse,
  isUsingMemory,
  setUseInMemory
};
