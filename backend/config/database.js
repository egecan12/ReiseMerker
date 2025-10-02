const mongoose = require('mongoose');
const { setUseInMemory } = require('../utils/helpers');

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/location-tracker';

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful');
    setUseInMemory(false);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Using in-memory storage');
    setUseInMemory(true);
  }
};

// Monitor MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
  setUseInMemory(false);
});

mongoose.connection.on('error', () => {
  console.log('MongoDB connection error');
  setUseInMemory(true);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost');
  setUseInMemory(true);
});

// Use in-memory storage if no MongoDB URI provided
if (!process.env.MONGODB_URI) {
  setUseInMemory(true);
  console.log('⚠️  MONGODB_URI not found, using in-memory storage');
}

module.exports = {
  connectDatabase,
  MONGODB_URI
};
