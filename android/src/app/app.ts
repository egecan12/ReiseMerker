import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { LocationService } from './services/location';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'Location Notebook Android';
  currentRoute = '';
  private subscription = new Subscription();

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trackRouteChanges();
    this.loadLocations();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private trackRouteChanges(): void {
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentRoute = event.url;
        })
    );
  }

  private loadLocations(): void {
    // Load locations on app start
    this.locationService.loadLocations();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
