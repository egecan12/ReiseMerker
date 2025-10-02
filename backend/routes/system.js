const express = require('express');
const mongoose = require('mongoose');
const { testCloudinaryConnection } = require('../config/cloudinary');
const { isUsingMemory } = require('../utils/helpers');

const router = express.Router();

// Cloudinary config check
router.get('/cloudinary-test', (req, res) => {
  const isUrlConfigured = !!process.env.CLOUDINARY_URL;
  const isIndividualConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  
  res.json({
    success: true,
    cloudinary_configured: isUrlConfigured || isIndividualConfigured,
    configuration_method: isUrlConfigured ? 'CLOUDINARY_URL' : (isIndividualConfigured ? 'Individual Variables' : 'NOT_CONFIGURED'),
    cloudinary_url: process.env.CLOUDINARY_URL ? 'SET' : 'NOT_SET',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT_SET',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET'
  });
});

// Health check
router.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/location-tracker';

  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    database: {
      mongodb: {
        status: statusMap[mongoStatus] || 'unknown',
        uri: MONGODB_URI ? MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'not configured'
      },
      storage: isUsingMemory() ? 'memory' : 'mongodb',
      locations_count: isUsingMemory() ? 'check_memory' : 'check_mongodb'
    }
  });
});

module.exports = router;
