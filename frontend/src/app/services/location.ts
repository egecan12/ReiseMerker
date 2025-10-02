import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface PhotoData {
  id?: string;
  _id?: string; // MongoDB ObjectId
  url: string;
  publicId: string;
  originalName?: string;
  uploadedAt?: Date;
}

export interface LocationData {
  id?: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  timestamp?: Date;
  photos?: PhotoData[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/api`;
  private locationsSubject = new BehaviorSubject<LocationData[]>([]);
  public locations$ = this.locationsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Only load locations if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadLocations();
    }
  }

  // Get current position using Geolocation API
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission denied'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information unavailable'));
              break;
            case error.TIMEOUT:
              reject(new Error('Location request timed out'));
              break;
            default:
              reject(new Error('Unknown location error'));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Load all locations
  loadLocations(): void {
    if (!this.authService.isAuthenticated()) {
      console.warn('User not authenticated, cannot load locations');
      return;
    }

    const headers = this.authService.getAuthHeaders();
    this.http.get<ApiResponse<LocationData[]>>(`${this.apiUrl}/locations`, { headers })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.locationsSubject.next(response.data);
          }
        },
        error: (error) => {
          console.error('Failed to load locations:', error);
          if (error.status === 401) {
            // Token expired, redirect to login
            this.authService.clearAuthData();
          }
        }
      });
  }

  // Save new location
  saveLocation(location: Omit<LocationData, 'id' | 'timestamp'>): Observable<ApiResponse<LocationData>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<ApiResponse<LocationData>>(`${this.apiUrl}/locations`, location, { headers });
  }

  // Delete location
  deleteLocation(id: string): Observable<ApiResponse<any>> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/locations/${id}`, { headers });
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

  // Generate Apple Maps URL
  getAppleMapsUrl(latitude: number, longitude: number): string {
    return `https://maps.apple.com/?q=${latitude},${longitude}`;
  }

  // Upload photos for a location
  uploadPhotos(locationId: string, files: FileList): Observable<ApiResponse<any>> {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    let headers = this.authService.getAuthHeaders();
    // Remove Content-Type header for FormData uploads
    headers = headers.delete('Content-Type');
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/locations/${locationId}/photos`, formData, { headers });
  }

  // Delete a specific photo
  deletePhoto(locationId: string, photoId: string): Observable<ApiResponse<any>> {
    // Encode the photoId to handle slashes in Cloudinary publicId
    const encodedPhotoId = encodeURIComponent(photoId);
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/locations/${locationId}/photos/${encodedPhotoId}`, { headers });
  }
}
