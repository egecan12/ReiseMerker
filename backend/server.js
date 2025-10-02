const express = require('express');
// Load environment variables
require('dotenv').config();

// Import configurations
const { connectDatabase } = require('./config/database');
const { testCloudinaryConnection } = require('./config/cloudinary');

// Import middleware
const { 
  corsMiddleware, 
  sessionMiddleware, 
  passportMiddleware, 
  passportSessionMiddleware 
} = require('./middleware');

// Import routes
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/locations');
const systemRoutes = require('./routes/system');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(sessionMiddleware);
app.use(passportMiddleware);
app.use(passportSessionMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api', systemRoutes);

// 404 handler - for undefined routes
app.use((req, res, next) => {
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

// Start server
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📍 Locations endpoint: http://localhost:${PORT}/api/locations`);
  console.log(`📸 Photo upload: POST http://localhost:${PORT}/api/locations/:id/photos`);
  console.log(`🗑️ Photo delete: DELETE http://localhost:${PORT}/api/locations/:locationId/photos/:photoId`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`☁️  Cloudinary test: http://localhost:${PORT}/api/cloudinary-test`);
  
  // Connect to database
  await connectDatabase();
  
  // Test Cloudinary connection
  console.log('🧪 Testing Cloudinary connection...');
  await testCloudinaryConnection();
});
