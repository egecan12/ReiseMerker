import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationService, LocationData, PhotoData } from '../../services/location';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-list-page',
  imports: [CommonModule],
  template: `
    <div class="location-list-page">
      <div class="page-header">
        <h2>📍 My Locations</h2>
        <p>Manage your saved locations and photos</p>
      </div>

      <div class="locations-container" *ngIf="!isLoading; else loadingTemplate">
        <div class="locations-grid" *ngIf="locations.length > 0; else emptyTemplate">
          <div class="location-card" *ngFor="let location of locations; trackBy: trackByLocation">
            <div class="location-header">
              <h3 class="location-name">{{ location.name }}</h3>
              <div class="location-actions">
                <button class="btn-icon" (click)="openInMaps(location)" title="Open in Maps">
                  🗺️
                </button>
                <button class="btn-icon btn-delete" (click)="deleteLocation(location)" title="Delete Location">
                  🗑️
                </button>
              </div>
            </div>
            
            <div class="location-details">
              <div class="coordinate">
                <strong>Latitude:</strong> {{ formatCoordinate(location.latitude) }}
              </div>
              <div class="coordinate">
                <strong>Longitude:</strong> {{ formatCoordinate(location.longitude) }}
              </div>
              <div class="timestamp">
                <strong>Added:</strong> {{ formatDate(location.timestamp) }}
              </div>
              <div class="distance" *ngIf="locationDistance[location.id || location._id!]">
                <strong>Distance:</strong> {{ locationDistance[location.id || location._id!] }}
              </div>
            </div>

            <div class="location-description" *ngIf="location.description">
              <p>{{ location.description }}</p>
            </div>

            <div class="photos-section" *ngIf="location.photos && location.photos.length > 0">
              <h4>Photos ({{ location.photos.length }})</h4>
              <div class="photos-grid">
                <div class="photo-item" *ngFor="let photo of location.photos">
                  <img [src]="photo.url" [alt]="photo.originalName || 'Location photo'" 
                       (click)="viewPhoto(photo)" class="photo-thumbnail">
                  <div class="photo-actions">
                    <button class="btn-icon btn-delete" (click)="deletePhoto(location, photo)" 
                            title="Delete Photo">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyTemplate>
          <div class="empty-state">
            <div class="empty-icon">📍</div>
            <h3>No locations yet</h3>
            <p>Start by adding your first location!</p>
            <button class="btn btn-primary" (click)="navigateToTracker()">
              ➕ Add Location
            </button>
          </div>
        </ng-template>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading locations...</p>
        </div>
      </ng-template>

      <!-- Message Display -->
      <div class="message" *ngIf="message" [class]="'message-' + messageType">
        <span>{{ message }}</span>
        <button class="message-close" (click)="clearMessage()">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .location-list-page {
      padding: 20px 0;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-header h2 {
      color: white;
      font-size: 2rem;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .page-header p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.1rem;
    }

    .locations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 25px;
    }

    .location-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .location-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }

    .location-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e2e8f0;
    }

    .location-name {
      margin: 0;
      color: #2d3748;
      font-size: 1.4rem;
      font-weight: 700;
    }

    .location-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      font-size: 1.2rem;
      transition: all 0.2s ease;
    }

    .btn-icon:hover {
      background: #f7fafc;
      transform: scale(1.1);
    }

    .btn-delete:hover {
      background: #fed7d7;
      color: #e53e3e;
    }

    .location-details {
      margin-bottom: 20px;
    }

    .location-details > div {
      margin-bottom: 8px;
      color: #4a5568;
      font-size: 0.95rem;
    }

    .location-description {
      margin-bottom: 20px;
      padding: 15px;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .location-description p {
      margin: 0;
      color: #2d3748;
      line-height: 1.5;
    }

    .photos-section {
      margin-top: 20px;
    }

    .photos-section h4 {
      margin: 0 0 15px 0;
      color: #2d3748;
      font-size: 1.1rem;
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 15px;
    }

    .photo-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .photo-thumbnail {
      width: 100%;
      height: 120px;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .photo-thumbnail:hover {
      transform: scale(1.05);
    }

    .photo-actions {
      position: absolute;
      top: 5px;
      right: 5px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .photo-item:hover .photo-actions {
      opacity: 1;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }

    .empty-state p {
      font-size: 1.1rem;
      margin-bottom: 30px;
      opacity: 0.8;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 400px;
    }

    .message-success {
      background: #48bb78;
    }

    .message-error {
      background: #f56565;
    }

    .message-info {
      background: #4299e1;
    }

    .message-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
      margin-left: auto;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    @media (max-width: 768px) {
      .locations-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .location-card {
        padding: 20px;
      }
      
      .photos-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
      }
    }
  `]
})
export class LocationListPageComponent implements OnInit, OnDestroy {
  locations: LocationData[] = [];
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  locationDistance: { [key: string]: string } = {};
  private subscription: Subscription = new Subscription();

  constructor(
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadLocations();
    
    // Listen to changes in location list
    this.subscription.add(
      this.locationService.locations$.subscribe({
        next: (locations) => {
          this.locations = locations;
          this.calculateDistances();
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

  loadLocations(): void {
    this.isLoading = true;
    this.locationService.loadLocations();
    
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  deleteLocation(location: LocationData): void {
    const locationId = location.id || location._id;
    
    if (!locationId) {
      this.message = 'Location ID missing - cannot delete';
      this.messageType = 'error';
      return;
    }
    
    const confirmed = confirm(`Are you sure you want to delete "${location.name}" location?`);
    if (!confirmed) return;

    this.locationService.deleteLocation(locationId).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = 'Location deleted successfully';
          this.messageType = 'success';
          this.locationService.loadLocations();
        } else {
          this.message = response.message || 'Delete operation failed';
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

  deletePhoto(location: LocationData, photo: PhotoData): void {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    const locationId = location.id || location._id;
    if (!locationId) return;

    this.locationService.deletePhoto(locationId, photo.publicId).subscribe({
      next: (response) => {
        if (response.success) {
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

  viewPhoto(photo: PhotoData): void {
    window.open(photo.url, '_blank');
  }

  openInMaps(location: LocationData): void {
    const url = this.locationService.getAppleMapsUrl(location.latitude, location.longitude);
    window.open(url, '_blank');
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Date not specified';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  formatCoordinate(coord: number): string {
    return coord.toFixed(6);
  }

  async calculateDistances(): Promise<void> {
    for (const location of this.locations) {
      try {
        const currentPos = await this.locationService.getCurrentPosition();
        const distance = this.locationService.calculateDistance(
          currentPos.latitude,
          currentPos.longitude,
          location.latitude,
          location.longitude
        );
        
        const locationId = location.id || location._id!;
        if (distance < 1) {
          this.locationDistance[locationId] = `${(distance * 1000).toFixed(0)}m`;
        } else {
          this.locationDistance[locationId] = `${distance.toFixed(1)}km`;
        }
      } catch (error) {
        const locationId = location.id || location._id!;
        this.locationDistance[locationId] = 'Distance unavailable';
      }
    }
  }

  trackByLocation(index: number, location: LocationData): string {
    return location.id || location._id || index.toString();
  }

  clearMessage(): void {
    this.message = '';
  }

  navigateToTracker(): void {
    // This will be handled by the parent component's routing
    window.location.href = '/tracker';
  }
}
