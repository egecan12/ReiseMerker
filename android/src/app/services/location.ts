import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AndroidLocationService, PhotoData, LocationData } from './android-location.service';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Re-export types for components
export type { PhotoData, LocationData } from './android-location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationsSubject = new BehaviorSubject<LocationData[]>([]);
  public locations$ = this.locationsSubject.asObservable();

  constructor(private androidLocationService: AndroidLocationService) {
    // Load locations from Android service
    this.loadLocations();
  }

  // Get current position using Android Geolocation
  getCurrentPosition(): Promise<GeolocationPosition> {
    return this.androidLocationService.getCurrentPosition();
  }

  // Get address from coordinates
  getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    return this.androidLocationService.getAddressFromCoordinates(latitude, longitude);
  }

  // Load all locations from Android service
  loadLocations(): void {
    this.androidLocationService.locations$.subscribe(locations => {
      this.locationsSubject.next(locations);
    });
  }

  // Save new location
  saveLocation(location: Omit<LocationData, 'id' | 'timestamp' | 'photos'>): Observable<LocationData> {
    return new Observable(observer => {
      this.androidLocationService.addLocation(location)
        .then(savedLocation => {
          observer.next(savedLocation);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Delete location
  deleteLocation(id: string): Observable<boolean> {
    return new Observable(observer => {
      this.androidLocationService.deleteLocation(id)
        .then(success => {
          observer.next(success);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Calculate distance between locations (in kilometers)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    return this.androidLocationService.calculateDistance(lat1, lon1, lat2, lon2);
  }

  // Generate Google Maps URL for Android
  getGoogleMapsUrl(latitude: number, longitude: number): string {
    return this.androidLocationService.getGoogleMapsUrl(latitude, longitude);
  }

  // Generate Apple Maps URL (for iOS compatibility)
  getAppleMapsUrl(latitude: number, longitude: number): string {
    return `https://maps.apple.com/?q=${latitude},${longitude}`;
  }

  // Take photo using Android Camera
  takePhoto(): Observable<PhotoData> {
    return new Observable(observer => {
      this.androidLocationService.takePhoto()
        .then(photo => {
          observer.next(photo);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Select photo from gallery
  selectPhoto(): Observable<PhotoData> {
    return new Observable(observer => {
      this.androidLocationService.selectPhoto()
        .then(photo => {
          observer.next(photo);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Upload photos for a location (legacy method for compatibility)
  uploadPhotos(locationId: string, files: FileList): Observable<PhotoData[]> {
    return new Observable(observer => {
      const uploadPromises: Promise<PhotoData>[] = [];
      
      for (let i = 0; i < files.length; i++) {
        // Convert File to PhotoData format
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const photoData: PhotoData = {
            id: this.generateId(),
            url: reader.result as string,
            originalName: file.name,
            uploadedAt: new Date(),
            publicId: this.generateId()
          };
          uploadPromises.push(
            this.androidLocationService.addPhotoToLocation(locationId, photoData)
          );
        };
        reader.readAsDataURL(file);
      }

      Promise.all(uploadPromises)
        .then(photos => {
          observer.next(photos);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Delete a specific photo
  deletePhoto(locationId: string, photoId: string): Observable<boolean> {
    return new Observable(observer => {
      this.androidLocationService.deletePhotoFromLocation(locationId, photoId)
        .then(success => {
          observer.next(success);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}