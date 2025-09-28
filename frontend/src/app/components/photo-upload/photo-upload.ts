import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService, LocationData, PhotoData } from '../../services/location';

@Component({
  selector: 'app-photo-upload',
  imports: [CommonModule],
  templateUrl: './photo-upload.html',
  styleUrl: './photo-upload.css'
})
export class PhotoUploadComponent {
  @Input() location!: LocationData;
  @Output() photosUploaded = new EventEmitter<PhotoData[]>();
  @Output() photoDeleted = new EventEmitter<string>();

  selectedFiles: FileList | null = null;
  isUploading: boolean = false;
  uploadMessage: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  dragOver: boolean = false;
  isExpanded: boolean = false; // Collapsed by default

  constructor(private locationService: LocationService) {}

  // Toggle photo section visibility
  togglePhotoSection(): void {
    this.isExpanded = !this.isExpanded;
    
    // Clear message when closing
    if (!this.isExpanded) {
      this.uploadMessage = '';
    }
  }

  // Handle file selection
  onFileSelect(event: any): void {
    const files = event.target.files;
    this.validateAndSetFiles(files);
  }

  // Handle drag and drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.validateAndSetFiles(files);
    }
  }

  // Validate and set selected files
  private validateAndSetFiles(files: FileList): void {
    if (!files || files.length === 0) {
      return;
    }

    // Check file count (max 5)
    if (files.length > 5) {
      this.showMessage('Maximum 5 photos can be uploaded at once', 'error');
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        this.showMessage(`${file.name} is not a valid image file`, 'error');
        return;
      }
      
      // Check file size
      if (file.size > maxSize) {
        this.showMessage(`${file.name} is too large. Max size is 5MB`, 'error');
        return;
      }
      
      validFiles.push(file);
    }

    // Convert back to FileList-like object
    const dt = new DataTransfer();
    validFiles.forEach(file => dt.items.add(file));
    this.selectedFiles = dt.files;
    
    this.showMessage(`${this.selectedFiles.length} photo(s) selected`, 'info');
  }

  // Upload selected photos
  uploadPhotos(): void {
    const locationId = this.location.id || this.location._id;
    
    console.log('Upload clicked!', {
      selectedFiles: this.selectedFiles?.length,
      locationId: locationId,
      location: this.location
    });
    
    if (!this.selectedFiles || !locationId) {
      this.showMessage('No files selected or location ID missing', 'error');
      return;
    }

    this.isUploading = true;
    this.showMessage('Uploading photos...', 'info');

    this.locationService.uploadPhotos(locationId, this.selectedFiles).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage(response.message || 'Photos uploaded successfully!', 'success');
          this.photosUploaded.emit(response.data?.photos || []);
          this.clearSelection();
        } else {
          this.showMessage(response.message || 'Upload failed', 'error');
        }
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.showMessage('Error occurred while uploading photos', 'error');
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }

  // Delete a photo
  deletePhoto(photo: PhotoData): void {
    const locationId = this.location.id || this.location._id;
    
    console.log('🗑️ Delete photo called:', {
      locationId: locationId,
      photoPublicId: photo.publicId,
      location: this.location
    });

    if (!locationId) {
      console.error('❌ No location ID found');
      this.showMessage('Location ID missing - cannot delete photo', 'error');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete this photo?`);
    if (!confirmed) return;

    this.locationService.deletePhoto(locationId, photo.publicId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Photo deleted successfully', 'success');
          this.photoDeleted.emit(photo.publicId);
        } else {
          this.showMessage(response.message || 'Delete failed', 'error');
        }
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.showMessage('Error occurred while deleting photo', 'error');
      }
    });
  }

  // Clear file selection
  clearSelection(): void {
    this.selectedFiles = null;
    this.uploadMessage = '';
    
    // Reset file input
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Show message
  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.uploadMessage = message;
    this.messageType = type;
    
    // Auto-clear success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.uploadMessage = '';
      }, 3000);
    }
  }

  // Clear message
  clearMessage(): void {
    this.uploadMessage = '';
  }

  // Get selected file names
  getSelectedFileNames(): string {
    if (!this.selectedFiles) return '';
    
    const names = Array.from(this.selectedFiles).map(file => file.name);
    return names.join(', ');
  }

  // Check if photos exist
  hasPhotos(): boolean {
    return !!(this.location.photos && this.location.photos.length > 0);
  }

  // TrackBy function for photos
  trackByPhoto(index: number, photo: PhotoData): string {
    return photo.publicId;
  }

  // Open photo in new tab
  openPhotoModal(photo: PhotoData): void {
    window.open(photo.url, '_blank');
  }

  // Get upload button title for debugging
  getUploadButtonTitle(): string {
    const locationId = this.location.id || this.location._id;
    if (!locationId) {
      return 'Location ID is missing - cannot upload';
    }
    if (!this.selectedFiles) {
      return 'No files selected';
    }
    return 'Click to upload photos';
  }
}