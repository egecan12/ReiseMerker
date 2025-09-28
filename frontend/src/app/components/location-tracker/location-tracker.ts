import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService, LocationData, GeolocationPosition, PhotoData } from '../../services/location';

@Component({
  selector: 'app-location-tracker',
  imports: [CommonModule, FormsModule],
  templateUrl: './location-tracker.html',
  styleUrl: './location-tracker.css'
})
export class LocationTrackerComponent {
  locationName: string = '';
  description: string = '';
  currentPosition: GeolocationPosition | null = null;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  selectedFiles: FileList | null = null;
  savedLocationId: string | null = null;

  constructor(private locationService: LocationService) {}


  // Save location (auto-get location first)
  async saveLocation(): Promise<void> {
    console.log('🚀 Save Location Called!');

    if (!this.locationName.trim()) {
      this.message = 'Please enter a location name';
      this.messageType = 'error';
      console.log('❌ No location name');
      return;
    }

    this.isLoading = true;
    this.message = 'Getting your location...';
    this.messageType = 'info';

    try {
      // First, get current location automatically
      this.currentPosition = await this.locationService.getCurrentPosition();
      
      console.log('✅ Location retrieved, now saving...', this.currentPosition);
      
      // Then save the location
      this.message = 'Saving location...';
      
      const locationData: Omit<LocationData, 'id' | 'timestamp'> = {
        name: this.locationName.trim(),
        latitude: this.currentPosition.latitude,
        longitude: this.currentPosition.longitude,
        description: this.description.trim()
      };

      this.locationService.saveLocation(locationData).subscribe({
        next: (response) => {
          if (response.success) {
            this.savedLocationId = response.data?.id || response.data?._id || null;
            
            if (this.selectedFiles && this.selectedFiles.length > 0 && this.savedLocationId) {
              // Upload photos if files are selected
              this.uploadPhotos();
            } else {
              this.message = 'Location saved successfully!';
              this.messageType = 'success';
              this.resetForm();
              this.locationService.loadLocations(); // Refresh the list
            }
          } else {
            this.message = response.message || 'Save failed';
            this.messageType = 'error';
          }
        },
        error: (error) => {
          this.message = 'Error occurred while saving';
          this.messageType = 'error';
          console.error('Save error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
      
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Error occurred while getting location';
      this.messageType = 'error';
      this.currentPosition = null;
      this.isLoading = false;
    }
  }

  // Reset form
  resetForm(): void {
    this.locationName = '';
    this.description = '';
    this.currentPosition = null;
    this.selectedFiles = null;
    this.savedLocationId = null;
    
    // Reset file input
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Show in Google Maps
  openInMaps(): void {
    if (this.currentPosition) {
      const url = this.locationService.getGoogleMapsUrl(
        this.currentPosition.latitude, 
        this.currentPosition.longitude
      );
      window.open(url, '_blank');
    }
  }

  // Clear message
  clearMessage(): void {
    this.message = '';
  }

  // Handle file selection
  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length > 5) {
        this.message = 'Maximum 5 photos can be selected';
        this.messageType = 'error';
        return;
      }

      // Validate files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          this.message = `${file.name} is not a valid image file`;
          this.messageType = 'error';
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
          this.message = `${file.name} is too large. Max size is 5MB`;
          this.messageType = 'error';
          return;
        }
      }

      this.selectedFiles = files;
      this.message = `${files.length} photo(s) selected`;
      this.messageType = 'info';
    }
  }

  // Upload photos after location is saved
  private uploadPhotos(): void {
    if (!this.selectedFiles || !this.savedLocationId) {
      return;
    }

    this.message = 'Uploading photos...';
    this.messageType = 'info';

    this.locationService.uploadPhotos(this.savedLocationId, this.selectedFiles).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = `Location and ${this.selectedFiles!.length} photo(s) saved successfully!`;
          this.messageType = 'success';
          this.resetForm();
          this.locationService.loadLocations();
        } else {
          this.message = 'Location saved but photo upload failed: ' + response.message;
          this.messageType = 'error';
        }
      },
      error: (error) => {
        console.error('Photo upload error:', error);
        this.message = 'Location saved but photo upload failed';
        this.messageType = 'error';
        this.resetForm();
        this.locationService.loadLocations();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Get selected file names for display
  getSelectedFileNames(): string {
    if (!this.selectedFiles) return '';
    const names = Array.from(this.selectedFiles).map(file => file.name);
    return names.join(', ');
  }

}
