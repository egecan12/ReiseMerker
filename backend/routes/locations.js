const express = require('express');
const { verifyToken } = require('../config/auth');
const { upload, deleteImage } = require('../config/cloudinary');
const { Location } = require('../models/Location');
const { sendErrorResponse, sendSuccessResponse, isUsingMemory } = require('../utils/helpers');

const router = express.Router();

// In-memory storage for fallback
let locations = [];

// Get all locations (filtered by authenticated user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    let locationData;
    
    if (isUsingMemory()) {
      locationData = locations
        .filter(loc => loc.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else {
      locationData = await Location.find({ userId }).sort({ timestamp: -1 });
    }
    
    res.json({
      success: true,
      data: locationData,
      source: isUsingMemory() ? 'memory' : 'mongodb'
    });
  } catch (error) {
    console.error('Location retrieval error:', error);
    sendErrorResponse(res, 500, 'Failed to retrieve locations', error);
  }
});

// Save new location
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, latitude, longitude, description } = req.body;
    const userId = req.user.googleId;

    // Validation
    if (!name || latitude === undefined || longitude === undefined) {
      return sendErrorResponse(res, 400, 'Name, latitude and longitude fields are required');
    }

    // Check if coordinates are valid
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return sendErrorResponse(res, 400, 'Invalid coordinates');
    }

    let savedLocation;

    if (isUsingMemory()) {
      const newLocation = {
        id: Date.now().toString(),
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || '',
        userId,
        timestamp: new Date()
      };
      locations.push(newLocation);
      savedLocation = newLocation;
    } else {
      const location = new Location({
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || '',
        userId
      });
      savedLocation = await location.save();
    }

    sendSuccessResponse(res, savedLocation, 'Location saved successfully', 201);
  } catch (error) {
    console.error('Location save error:', error);
    sendErrorResponse(res, 500, 'Failed to save location', error);
  }
});

// Upload photos for a location
router.post('/:id/photos', verifyToken, upload.array('photos', 5), async (req, res) => {
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
    
    if (isUsingMemory()) {
      const index = locations.findIndex(loc => loc.id === id && loc.userId === userId);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      if (!locations[index].photos) {
        locations[index].photos = [];
      }

      const newPhotos = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        uploadedAt: new Date()
      }));

      locations[index].photos.push(...newPhotos);
      location = locations[index];
    } else {
      location = await Location.findOne({ _id: id, userId });
      
      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      const newPhotos = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        uploadedAt: new Date()
      }));

      location.photos.push(...newPhotos);
      await location.save();
    }

    res.status(201).json({
      success: true,
      message: `${req.files.length} photo(s) uploaded successfully`,
      data: {
        locationId: id,
        photos: location.photos.slice(-req.files.length) // Return only newly added photos
      },
      source: isUsingMemory() ? 'memory' : 'mongodb'
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
router.delete('/:locationId/photos/:photoId', verifyToken, async (req, res) => {
  try {
    const { locationId } = req.params;
    const userId = req.user.googleId;
    const photoId = decodeURIComponent(req.params.photoId);
    
    let location;
    let photoToDelete;

    if (isUsingMemory()) {
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
    } else {
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
    }

    // Delete from Cloudinary
    try {
      await deleteImage(photoToDelete.publicId);
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
      source: isUsingMemory() ? 'memory' : 'mongodb'
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
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.googleId;
    
    let deletedLocation;

    if (isUsingMemory()) {
      const index = locations.findIndex(loc => loc.id === id && loc.userId === userId);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }

      deletedLocation = locations.splice(index, 1)[0];
    } else {
      deletedLocation = await Location.findOneAndDelete({ _id: id, userId });
      
      if (!deletedLocation) {
        return res.status(404).json({
          success: false,
          message: 'Location not found or access denied'
        });
      }
    }

    // Delete associated photos from Cloudinary
    if (deletedLocation.photos && deletedLocation.photos.length > 0) {
      for (const photo of deletedLocation.photos) {
        try {
          await deleteImage(photo.publicId);
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
      source: isUsingMemory() ? 'memory' : 'mongodb'
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

module.exports = router;
