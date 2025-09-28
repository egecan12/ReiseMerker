import { Component } from '@angular/core';
import { LocationTrackerComponent } from './components/location-tracker/location-tracker';
import { LocationListComponent } from './components/location-list/location-list';

@Component({
  selector: 'app-root',
  imports: [LocationTrackerComponent, LocationListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Location Tracking App';
}
