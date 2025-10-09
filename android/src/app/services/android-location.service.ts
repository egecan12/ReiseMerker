import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PhotoData {
  id: string;
  _id?: string; // For compatibility with existing code
  url: string; // Base64 encoded image data
  originalName: string;
  uploadedAt: Date;
  filePath?: string; // For Android file system
  publicId?: string; // For compatibility with existing code
}

export interface LocationData {
  id: string;
  _id?: string; // For compatibility with existing code
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  timestamp: Date;
  photos: PhotoData[];
}

@Injectable({
  providedIn: 'root'
})
export class AndroidLocationService {
  private readonly STORAGE_KEY = 'location_notebook_data';
  private locationsSubject = new BehaviorSubject<LocationData[]>([]);
  public locations$ = this.locationsSubject.asObservable();

  constructor() {
    this.loadLocations();
  }

  // Load locations from local storage
  private async loadLocations(): Promise<void> {
    try {
      const storedData = await Filesystem.readFile({
        path: `${this.STORAGE_KEY}.json`,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      if (storedData.data) {
        const locations: LocationData[] = JSON.parse(storedData.data as string);
        // Convert date strings back to Date objects
        locations.forEach(location => {
          location.timestamp = new Date(location.timestamp);
          location.photos.forEach(photo => {
            photo.uploadedAt = new Date(photo.uploadedAt);
          });
        });
        this.locationsSubject.next(locations);
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
      this.locationsSubject.next([]);
    }
  }

  // Save locations to file system
  private async saveLocations(locations: LocationData[]): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: `${this.STORAGE_KEY}.json`,
        data: JSON.stringify(locations),
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      this.locationsSubject.next(locations);
    } catch (error) {
      console.error('Error saving locations:', error);
    }
  }

  // Get current position using Capacitor Geolocation
  async getCurrentPosition(): Promise<{latitude: number, longitude: number, accuracy: number}> {
    try {
      // Check permissions first
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        // Request permissions
        const requestResult = await Geolocation.requestPermissions();
        
        if (requestResult.location !== 'granted') {
          throw new Error('Location permission denied. Please enable location access in settings.');
        }
      }

      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw new Error('Location permission denied or unavailable. Please check your location settings.');
    }
  }

  // Add new location
  async addLocation(location: Omit<LocationData, 'id' | 'timestamp' | 'photos'>): Promise<LocationData> {
    const newLocation: LocationData = {
      ...location,
      id: this.generateId(),
      timestamp: new Date(),
      photos: []
    };

    const currentLocations = this.locationsSubject.value;
    const updatedLocations = [...currentLocations, newLocation];
    await this.saveLocations(updatedLocations);
    
    return newLocation;
  }

  // Update existing location
  async updateLocation(id: string, updates: Partial<LocationData>): Promise<LocationData | null> {
    const currentLocations = this.locationsSubject.value;
    const locationIndex = currentLocations.findIndex(loc => loc.id === id);
    
    if (locationIndex === -1) {
      return null;
    }

    const updatedLocation = { ...currentLocations[locationIndex], ...updates };
    const updatedLocations = [...currentLocations];
    updatedLocations[locationIndex] = updatedLocation;
    
    await this.saveLocations(updatedLocations);
    return updatedLocation;
  }

  // Delete location
  async deleteLocation(id: string): Promise<boolean> {
    const currentLocations = this.locationsSubject.value;
    const updatedLocations = currentLocations.filter(loc => loc.id !== id);
    
    if (updatedLocations.length === currentLocations.length) {
      return false; // Location not found
    }

    await this.saveLocations(updatedLocations);
    return true;
  }

  // Take photo using Capacitor Camera
  async takePhoto(): Promise<PhotoData> {
    try {
      // Check camera permissions first
      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera !== 'granted') {
        // Request permissions
        const requestResult = await Camera.requestPermissions();
        
        if (requestResult.camera !== 'granted') {
          throw new Error('Camera permission denied. Please enable camera access in settings.');
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      const photoData: PhotoData = {
        id: this.generateId(),
        url: `data:image/jpeg;base64,${image.base64String}`,
        originalName: `photo_${Date.now()}.jpg`,
        uploadedAt: new Date(),
        publicId: this.generateId() // Add publicId for compatibility
      };

      return photoData;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw new Error('Failed to take photo. Please check camera permissions.');
    }
  }

  // Select photo from gallery
  async selectPhoto(): Promise<PhotoData> {
    try {
      // Check camera permissions first
      const permissions = await Camera.checkPermissions();
      
      if (permissions.photos !== 'granted') {
        // Request permissions
        const requestResult = await Camera.requestPermissions();
        
        if (requestResult.photos !== 'granted') {
          throw new Error('Photo gallery permission denied. Please enable photo access in settings.');
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      const photoData: PhotoData = {
        id: this.generateId(),
        url: `data:image/jpeg;base64,${image.base64String}`,
        originalName: `photo_${Date.now()}.jpg`,
        uploadedAt: new Date(),
        publicId: this.generateId() // Add publicId for compatibility
      };

      return photoData;
    } catch (error) {
      console.error('Error selecting photo:', error);
      throw new Error('Failed to select photo. Please check photo gallery permissions.');
    }
  }

  // Add photo to location
  async addPhotoToLocation(locationId: string, photoData: PhotoData): Promise<PhotoData> {
    const currentLocations = this.locationsSubject.value;
    const locationIndex = currentLocations.findIndex(loc => loc.id === locationId);
    
    if (locationIndex === -1) {
      throw new Error('Location not found');
    }

    const updatedLocation = {
      ...currentLocations[locationIndex],
      photos: [...currentLocations[locationIndex].photos, photoData]
    };

    const updatedLocations = [...currentLocations];
    updatedLocations[locationIndex] = updatedLocation;
    
    await this.saveLocations(updatedLocations);
    return photoData;
  }

  // Delete photo from location
  async deletePhotoFromLocation(locationId: string, photoId: string): Promise<boolean> {
    const currentLocations = this.locationsSubject.value;
    const locationIndex = currentLocations.findIndex(loc => loc.id === locationId);
    
    if (locationIndex === -1) {
      return false;
    }

    const location = currentLocations[locationIndex];
    const updatedPhotos = location.photos.filter(photo => photo.id !== photoId);
    
    if (updatedPhotos.length === location.photos.length) {
      return false; // Photo not found
    }

    const updatedLocation = {
      ...location,
      photos: updatedPhotos
    };

    const updatedLocations = [...currentLocations];
    updatedLocations[locationIndex] = updatedLocation;
    
    await this.saveLocations(updatedLocations);
    return true;
  }

  // Get all locations
  getLocations(): LocationData[] {
    return this.locationsSubject.value;
  }

  // Get location by ID
  getLocationById(id: string): LocationData | null {
    return this.locationsSubject.value.find(loc => loc.id === id) || null;
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: `${this.STORAGE_KEY}.json`,
        directory: Directory.Data
      });
      this.locationsSubject.next([]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Export data as JSON
  exportData(): string {
    return JSON.stringify(this.locationsSubject.value, null, 2);
  }

  // Import data from JSON
  async importData(jsonData: string): Promise<boolean> {
    try {
      const locations: LocationData[] = JSON.parse(jsonData);
      
      // Validate the data structure
      if (!Array.isArray(locations)) {
        throw new Error('Invalid data format');
      }

      // Convert date strings back to Date objects
      locations.forEach(location => {
        location.timestamp = new Date(location.timestamp);
        location.photos.forEach(photo => {
          photo.uploadedAt = new Date(photo.uploadedAt);
        });
      });

      await this.saveLocations(locations);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Calculate distance between locations (in kilometers)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius (km)
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Generate Google Maps URL
  getGoogleMapsUrl(latitude: number, longitude: number): string {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }
}
