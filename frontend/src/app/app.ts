import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationTrackerComponent } from './components/location-tracker/location-tracker';
import { LocationListComponent } from './components/location-list/location-list';

@Component({
  selector: 'app-root',
  imports: [CommonModule, LocationTrackerComponent, LocationListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Reise Merken';
  showAddLocationModal = false;

  openAddLocation(): void {
    this.showAddLocationModal = true;
  }

  closeAddLocation(): void {
    this.showAddLocationModal = false;
  }
}
