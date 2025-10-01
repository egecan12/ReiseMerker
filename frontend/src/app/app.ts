import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService, User } from './services/auth.service';
import { LocationService } from './services/location';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'Location Notebook';
  isAuthenticated = false;
  currentUser: User | null = null;
  currentRoute = '';
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeAuthentication();
    this.trackRouteChanges();
    this.checkInitialAuth();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeAuthentication(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.isAuthenticated = !!user;
        this.currentUser = user;
        
        if (this.isAuthenticated) {
          this.locationService.loadLocations();
          this.handleAuthSuccessRedirect();
          this.redirectAuthenticatedUser();
        }
      })
    );
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

  private handleAuthSuccessRedirect(): void {
    if (this.router.url.includes('/auth-success')) {
      this.router.navigate(['/list']);
    }
  }

  private redirectAuthenticatedUser(): void {
    // If authenticated user is on demo page, redirect to list
    if (this.router.url === '/' || this.router.url === '/demo') {
      this.router.navigate(['/list']);
    }
  }

  private checkInitialAuth(): void {
    // Check authentication status on app initialization
    if (this.authService.isAuthenticated()) {
      // If authenticated and on root or demo, redirect to list
      if (this.router.url === '/' || this.router.url === '/demo') {
        this.router.navigate(['/list']);
      }
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/demo']),
      error: () => this.router.navigate(['/demo'])
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
