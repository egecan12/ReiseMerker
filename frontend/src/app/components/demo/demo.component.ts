import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  imports: [CommonModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  // Demo data - sample locations
  demoLocations = [
    {
      id: 'demo-1',
      name: 'Golden Gate Bridge',
      latitude: 37.8199,
      longitude: -122.4783,
      description: 'Iconic suspension bridge spanning the Golden Gate strait.',
      timestamp: new Date('2024-01-15T10:30:00'),
      photos: [
        {
          id: 'demo-photo-1',
          url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
          originalName: 'golden-gate-bridge.jpg',
          uploadedAt: new Date('2024-01-15T10:35:00')
        },
        {
          id: 'demo-photo-2',
          url: 'https://images.unsplash.com/photo-1542223616-740ef5d4e87c?w=400&h=300&fit=crop',
          originalName: 'golden-gate-sunset.jpg',
          uploadedAt: new Date('2024-01-15T18:20:00')
        }
      ]
    },
    {
      id: 'demo-2',
      name: 'Central Park',
      latitude: 40.7829,
      longitude: -73.9654,
      description: 'Large public park in Manhattan, New York City.',
      timestamp: new Date('2024-01-20T14:15:00'),
      photos: [
        {
          id: 'demo-photo-3',
          url: 'https://images.unsplash.com/photo-1494522358652-f30e61a3a8e0?w=400&h=300&fit=crop',
          originalName: 'central-park-lake.jpg',
          uploadedAt: new Date('2024-01-20T14:20:00')
        }
      ]
    },
    {
      id: 'demo-3',
      name: 'Eiffel Tower',
      latitude: 48.8584,
      longitude: 2.2945,
      description: 'Iron lattice tower on the Champ de Mars in Paris.',
      timestamp: new Date('2024-01-25T16:45:00'),
      photos: [
        {
          id: 'demo-photo-4',
          url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop',
          originalName: 'eiffel-tower-night.jpg',
          uploadedAt: new Date('2024-01-25T20:30:00')
        },
        {
          id: 'demo-photo-5',
          url: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400&h=300&fit=crop',
          originalName: 'eiffel-tower-day.jpg',
          uploadedAt: new Date('2024-01-26T11:15:00')
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  formatCoordinate(coord: number): string {
    return coord.toFixed(6);
  }

  formatDate(timestamp: Date): string {
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
  }

  openInMaps(location: any): void {
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  trackByLocation(index: number, location: any): string {
    return location.id;
  }

  trackByPhoto(index: number, photo: any): string {
    return photo.id;
  }
}
