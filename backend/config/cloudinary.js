const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
if (process.env.CLOUDINARY_URL) {
  // If CLOUDINARY_URL is provided, use it directly
  cloudinary.config(process.env.CLOUDINARY_URL);
  console.log('✅ Cloudinary configured successfully with CLOUDINARY_URL');
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Otherwise use individual environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured successfully with individual variables');
} else {
  console.log('⚠️  Cloudinary not configured - please set CLOUDINARY_URL or individual variables in .env');
}

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'location-tracker', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Resize images
      { quality: 'auto:good' } // Optimize quality
    ],
  },
});

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Get image details
const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting image details:', error);
    throw error;
  }
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('🚀 Cloudinary connection test successful!', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  upload,
  deleteImage,
  getImageDetails,
  testCloudinaryConnection,
};
