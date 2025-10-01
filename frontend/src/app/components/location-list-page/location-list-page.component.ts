import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationService, LocationData, PhotoData } from '../../services/location';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-list-page',
  imports: [CommonModule],
  templateUrl: './location-list-page.component.html',
  styleUrl: './location-list-page.component.css'
})
export class LocationListPageComponent implements OnInit, OnDestroy {
  locations: LocationData[] = [];
  isLoading = true;
  selectedPhoto: PhotoData | null = null;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  locationDistance: { [key: string]: string } = {};
  private subscription: Subscription = new Subscription();

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    
    // Listen to changes in location list
    this.subscription.add(
      this.locationService.locations$.subscribe({
        next: (locations) => {
          this.locations = locations;
          this.isLoading = false;
          this.calculateDistances();
        },
        error: (error) => {
          console.error('Error loading locations:', error);
          this.showMessage('Failed to load locations', 'error');
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadLocations(): void {
    this.isLoading = true;
    this.locationService.loadLocations();
  }

  private calculateDistances(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locations.forEach(location => {
            const distance = this.calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              location.latitude,
              location.longitude
            );
            const locationId = location.id || location._id!;
            this.locationDistance[locationId] = distance;
          });
        },
        (error) => {
          console.warn('Could not get current position for distance calculation:', error);
        }
      );
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  trackByLocation(index: number, location: LocationData): string {
    return location.id || location._id || index.toString();
  }

  trackByPhoto(index: number, photo: PhotoData): string {
    return photo.id || photo._id || index.toString();
  }

  formatCoordinate(coord: number): string {
    return coord.toFixed(6);
  }

  formatDate(timestamp: string | Date | undefined): string {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  openInMaps(location: LocationData): void {
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  }

  deleteLocation(location: LocationData): void {
    if (confirm(`Are you sure you want to delete "${location.name}"? This will also delete all photos.`)) {
      const locationId = location.id || location._id!;
      this.locationService.deleteLocation(locationId).subscribe({
        next: () => {
          this.showMessage('Location deleted successfully', 'success');
        },
        error: (error) => {
          console.error('Error deleting location:', error);
          this.showMessage('Failed to delete location', 'error');
        }
      });
    }
  }

  deletePhoto(location: LocationData, photo: PhotoData): void {
    if (confirm(`Are you sure you want to delete this photo?`)) {
      const locationId = location.id || location._id!;
      const photoId = photo.id || photo._id!;
      this.locationService.deletePhoto(locationId, photoId).subscribe({
        next: () => {
          this.showMessage('Photo deleted successfully', 'success');
        },
        error: (error) => {
          console.error('Error deleting photo:', error);
          this.showMessage('Failed to delete photo', 'error');
        }
      });
    }
  }

  openPhotoModal(photo: PhotoData): void {
    this.selectedPhoto = photo;
  }

  closePhotoModal(): void {
    this.selectedPhoto = null;
  }

  navigateToTracker(): void {
    this.router.navigate(['/tracker']);
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}