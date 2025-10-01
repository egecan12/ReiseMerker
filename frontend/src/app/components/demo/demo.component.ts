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
  // Demo data - sample locations with mock images
  demoLocations = [
    {
      id: 'demo-1',
      name: 'Carolina Park',
      latitude: 40.7589,
      longitude: -73.9851,
      description: 'Beautiful urban park in the heart of Manhattan with stunning city views and peaceful walking paths.',
      timestamp: new Date('2024-01-15T10:30:00'),
      photos: [
        {
          id: 'demo-photo-1',
          url: '/mock-images/carolina-park.avif',
          originalName: 'carolina-park-view.jpg',
          uploadedAt: new Date('2024-01-15T10:35:00')
        }
      ]
    },
    {
      id: 'demo-2',
      name: 'Döner Baba Restaurant',
      latitude: 41.0082,
      longitude: 28.9784,
      description: 'Authentic Turkish döner restaurant in Istanbul, famous for its delicious kebabs and traditional flavors.',
      timestamp: new Date('2024-01-20T14:15:00'),
      photos: [
        {
          id: 'demo-photo-2',
          url: '/mock-images/doner-baba.avif',
          originalName: 'doner-baba-restaurant.jpg',
          uploadedAt: new Date('2024-01-20T14:20:00')
        }
      ]
    },
    {
      id: 'demo-3',
      name: 'Paris Bistro Café',
      latitude: 48.8566,
      longitude: 2.3522,
      description: 'Charming French bistro in the heart of Paris, offering exquisite cuisine and romantic atmosphere.',
      timestamp: new Date('2024-01-25T16:45:00'),
      photos: [
        {
          id: 'demo-photo-3',
          url: '/mock-images/paris-restaurant.avif',
          originalName: 'paris-bistro-cafe.jpg',
          uploadedAt: new Date('2024-01-25T16:50:00')
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
