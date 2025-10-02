const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
// Load environment variables
require('dotenv').config();

const { upload, deleteImage, testCloudinaryConnection } = require('./config/cloudinary');
const { passport, generateToken, verifyToken } = require('./config/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost',
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/location-tracker';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful');
    console.log('📍 Database:', MONGODB_URI);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  In-memory storage will be used');
  });

// Listen to MongoDB connection status
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost');
});

// Fallback: In-memory storage (if no MongoDB connection)
let locations = [];
let useInMemory = false;

// Monitor MongoDB connection status
mongoose.connection.on('connected', () => {
  useInMemory = false;
});

mongoose.connection.on('error', () => {
  useInMemory = true;
});

// Use in-memory storage if no MongoDB URI provided
if (!process.env.MONGODB_URI) {
  useInMemory = true;
  console.log('⚠️  MONGODB_URI not found, using in-memory storage');
}

// Location Schema (ready for MongoDB)
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

// Routes

// Authentication Routes
app.get('/api/auth/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost'}/login` }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost'}/auth-success?token=${token}`;
    console.log('🔐 OAuth Callback - FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('🔐 OAuth Callback - Redirect URL:', redirectUrl);
    res.redirect(redirectUrl);
  }
);

// Get current user info
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Get all locations (filtered by authenticated user)
app.get('/api/locations', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    let locationData;
    
    if (useInMemory || mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      locationData = locations
        .filter(loc => loc.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      console.log('📝 Locations retrieved from in-memory storage for user:', userId);
    } else {
      // Use MongoDB
      locationData = await Location.find({ userId }).sort({ timestamp: -1 });
      console.log('📝 Locations retrieved from MongoDB for user:', userId);
    }
    
    res.json({
      success: true,
      data: locationData,
      source: useInMemory || mongoose.connection.readyState !== 1 ? 'memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Location retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve locations',
      error: error.message
    });
  }
});

// Save new location
app.post('/api/locations', verifyToken, async (req, res) => {
  try {
    const { name, latitude, longitude, description } = req.body;
    const userId = req.user.googleId;

    // Validation
    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, latitude and longitude fields are required'
      });
    }

    // Check if coordinates are valid
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    let savedLocation;

    if (useInMemory || mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      const newLocation = {
        id: Date.now().toString(),
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || '',
        userId: userId,
        timestamp: new Date()
      };
      
      locations.push(newLocation);
      savedLocation = newLocation;
      console.log('💾 Location saved to in-memory storage for user:', userId);
    } else {
      // Use MongoDB
      const location = new Location({
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || '',
        userId: userId
      });
      
      savedLocation = await location.save();
      console.log('💾 Location saved to MongoDB for user:', userId);
    }

    res.status(201).json({
      success: true,
      message: 'Location saved successfully',
      data: savedLocation,
      source: useInMemory || mongoose.connection.readyState !== 1 ? 'memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Location save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save location',
      error: error.message
    });
  }
});

// Upload photos for a location
app.post('/api/locations/:id/photos', verifyToken, upload.array('photos', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.googleId;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos provided'
      });
    }

    let location;
    
    if (useInMemory || mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      const index = locations.findIndex(loc => loc.id === id && loc.userId === userId);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      // Initialize photos array if not exists
      if (!locations[index].photos) {
        locations[index].photos = [];
      }

      // Add new photos
      const newPhotos = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        uploadedAt: new Date()
      }));

      locations[index].photos.push(...newPhotos);
      location = locations[index];
      
      console.log('📸 Photos added to in-memory storage for user:', userId);
    } else {
      // Use MongoDB
      location = await Location.findOne({ _id: id, userId });
      
      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      // Add new photos
      const newPhotos = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        uploadedAt: new Date()
      }));

      location.photos.push(...newPhotos);
      await location.save();
      
      console.log('📸 Photos added to MongoDB for user:', userId);
    }

    res.status(201).json({
      success: true,
      message: `${req.files.length} photo(s) uploaded successfully`,
      data: {
        locationId: id,
        photos: location.photos.slice(-req.files.length) // Return only newly added photos
      },
      source: useInMemory || mongoose.connection.readyState !== 1 ? 'memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photos',
      error: error.message
    });
  }
});

// Delete a specific photo from a location
app.delete('/api/locations/:locationId/photos/:photoId', verifyToken, async (req, res) => {
  console.log('🗑️ ROUTE HIT: Delete photo endpoint called!');
  
  try {
    const { locationId } = req.params;
    const userId = req.user.googleId;
    // Decode the photoId to handle encoded slashes from Cloudinary publicId
    const photoId = decodeURIComponent(req.params.photoId);
    
    console.log('🗑️ Photo delete request received:', {
      locationId,
      photoId,
      userId,
      originalPhotoId: req.params.photoId,
      useInMemory,
      mongoState: mongoose.connection.readyState,
      url: req.url,
      method: req.method
    });
    
    let location;
    let photoToDelete;

    if (useInMemory || mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      const index = locations.findIndex(loc => loc.id === locationId && loc.userId === userId);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      if (!locations[index].photos) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      const photoIndex = locations[index].photos.findIndex(photo => photo.publicId === photoId);
      
      if (photoIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      photoToDelete = locations[index].photos[photoIndex];
      locations[index].photos.splice(photoIndex, 1);
      location = locations[index];
      
      console.log('🗑️ Photo removed from in-memory storage');
    } else {
      // Use MongoDB
      location = await Location.findOne({ _id: locationId, userId });
      
      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      const photoIndex = location.photos.findIndex(photo => photo.publicId === photoId);
      
      if (photoIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      photoToDelete = location.photos[photoIndex];
      location.photos.splice(photoIndex, 1);
      await location.save();
      
      console.log('🗑️ Photo removed from MongoDB');
    }

    // Delete from Cloudinary
    try {
      await deleteImage(photoToDelete.publicId);
      console.log('🗑️ Photo deleted from Cloudinary');
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }

    res.json({
      success: true,
      message: 'Photo deleted successfully',
      data: {
        locationId,
        deletedPhotoId: photoId
      },
      source: useInMemory || mongoose.connection.readyState !== 1 ? 'memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Photo deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete photo',
      error: error.message
    });
  }
});

// Delete location
app.delete('/api/locations/:id', verifyToken, async (req, res) => {
  console.log('🗑️ ROUTE HIT: Delete location endpoint called!');
  
  try {
    const { id } = req.params;
    const userId = req.user.googleId;
    
    console.log('🗑️ Location delete request received:', {
      locationId: id,
      userId,
      useInMemory,
      mongoState: mongoose.connection.readyState,
      url: req.url,
      method: req.method
    });
    
    let deletedLocation;

    if (useInMemory || mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      const index = locations.findIndex(loc => loc.id === id && loc.userId === userId);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      deletedLocation = locations.splice(index, 1)[0];
      console.log('🗑️ Location deleted from in-memory storage for user:', userId);
    } else {
      // Use MongoDB
      deletedLocation = await Location.findOneAndDelete({ _id: id, userId });
      
      if (!deletedLocation) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }
      console.log('🗑️ Location deleted from MongoDB for user:', userId);
    }

    // Delete associated photos from Cloudinary
    if (deletedLocation.photos && deletedLocation.photos.length > 0) {
      for (const photo of deletedLocation.photos) {
        try {
          await deleteImage(photo.publicId);
          console.log(`🗑️ Photo ${photo.publicId} deleted from Cloudinary`);
        } catch (cloudinaryError) {
          console.error(`Error deleting photo ${photo.publicId} from Cloudinary:`, cloudinaryError);
          // Continue even if some photos fail to delete
        }
      }
    }

    res.json({
      success: true,
      message: 'Location deleted successfully',
      data: deletedLocation,
      source: useInMemory || mongoose.connection.readyState !== 1 ? 'memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Location deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete location',
      error: error.message
    });
  }
});

// Cloudinary config check
app.get('/api/cloudinary-test', (req, res) => {
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
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    database: {
      mongodb: {
        status: statusMap[mongoStatus] || 'unknown',
        uri: MONGODB_URI ? MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'not configured'
      },
      storage: useInMemory || mongoStatus !== 1 ? 'memory' : 'mongodb',
      locations_count: useInMemory || mongoStatus !== 1 ? locations.length : 'check_mongodb'
    }
  });
});

// 404 handler - for undefined routes
app.use((req, res, next) => {
  console.log('❌ 404 - Route not found:', {
    path: req.path,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl
  });
  
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedPath: req.path,
    method: req.method,
    url: req.url
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
  });
});

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📍 Locations endpoint: http://localhost:${PORT}/api/locations`);
  console.log(`📸 Photo upload: POST http://localhost:${PORT}/api/locations/:id/photos`);
  console.log(`🗑️ Photo delete: DELETE http://localhost:${PORT}/api/locations/:locationId/photos/:photoId`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`☁️  Cloudinary test: http://localhost:${PORT}/api/cloudinary-test`);
  
  // Test Cloudinary connection
  console.log('🧪 Testing Cloudinary connection...');
  await testCloudinaryConnection();
});
