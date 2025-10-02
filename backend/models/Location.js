const mongoose = require('mongoose');

// Location Schema
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    required: true
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// MongoDB Location model
const Location = mongoose.model('Location', locationSchema);

module.exports = {
  Location
};
