import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService, LocationData, PhotoData } from '../../services/location';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-list',
  imports: [CommonModule],
  templateUrl: './location-list.html',
  styleUrl: './location-list.css'
})
export class LocationListComponent implements OnInit, OnDestroy {
  locations: LocationData[] = [];
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  private subscription: Subscription = new Subscription();

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
    
    // Listen to changes in location list
    this.subscription.add(
      this.locationService.locations$.subscribe({
        next: (locations) => {
          this.locations = locations;
        },
        error: (error) => {
          console.error('Location subscription error:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Load locations
  loadLocations(): void {
    this.isLoading = true;
    this.locationService.loadLocations();
    
    // Short delay for loading indicator
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  // Delete location
  deleteLocation(location: LocationData): void {
    const locationId = location.id || location._id;
    
    console.log('🗑️ Delete location called:', {
      locationId: locationId,
      location: location
    });

    if (!locationId) {
      console.error('❌ No location ID found');
      this.message = 'Location ID missing - cannot delete';
      this.messageType = 'error';
      return;
    }
    
    const confirmed = confirm(`Are you sure you want to delete "${location.name}" location?`);
    if (!confirmed) return;

    this.locationService.deleteLocation(locationId).subscribe({
      next: (success) => {
        if (success) {
          this.message = 'Location deleted successfully';
          this.messageType = 'success';
          this.locationService.loadLocations(); // Refresh the list
        } else {
          this.message = 'Delete operation failed';
          this.messageType = 'error';
        }
      },
      error: (error) => {
        this.message = 'Error occurred while deleting';
        this.messageType = 'error';
        console.error('Delete error:', error);
      }
    });
  }



  // Format coordinates
  formatCoordinate(coord: number): string {
    return coord.toFixed(6);
  }

  // Clear message
  clearMessage(): void {
    this.message = '';
  }

  // Calculate distance from current location
  async calculateDistanceFromCurrent(location: LocationData): Promise<string> {
    try {
      const currentPos = await this.locationService.getCurrentPosition();
      const distance = this.locationService.calculateDistance(
        currentPos.latitude,
        currentPos.longitude,
        location.latitude,
        location.longitude
      );
      
      if (distance < 1) {
        return `${(distance * 1000).toFixed(0)}m`;
      } else {
        return `${distance.toFixed(1)}km`;
      }
    } catch (error) {
      return 'Distance could not be calculated';
    }
  }

  // TrackBy function for performance
  trackByLocation(index: number, location: LocationData): string {
    return location.id || location._id || index.toString();
  }

  // Open in Apple Maps
  openInMaps(location: LocationData): void {
    const url = this.locationService.getAppleMapsUrl(location.latitude, location.longitude);
    window.open(url, '_blank');
  }


  // Delete photo
  deletePhoto(location: LocationData, photo: PhotoData): void {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    const locationId = location.id || location._id;
    if (!locationId) return;

    this.locationService.deletePhoto(locationId, photo.publicId || photo.id).subscribe({
      next: (success) => {
        if (success) {
          this.message = 'Photo deleted successfully';
          this.messageType = 'success';
          this.loadLocations();
        } else {
          this.message = 'Failed to delete photo';
          this.messageType = 'error';
        }
      },
      error: (error) => {
        console.error('Delete photo error:', error);
        this.message = 'Error deleting photo';
        this.messageType = 'error';
      }
    });
  }

  // View photo in full size
  viewPhoto(photo: PhotoData): void {
    window.open(photo.url, '_blank');
  }


  // Format date for display
  formatDate(timestamp: string | Date | undefined): string {
    if (!timestamp) return 'Date not specified';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

}
