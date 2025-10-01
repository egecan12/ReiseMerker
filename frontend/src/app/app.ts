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
    // Subscribe to authentication state
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.isAuthenticated = !!user;
          this.currentUser = user;
          
          if (this.isAuthenticated) {
            // Load locations when user is authenticated
            this.locationService.loadLocations();
            
            // If we're on auth-success page and now authenticated, redirect to main app
            if (this.router.url.includes('/auth-success')) {
              this.router.navigate(['/']);
            }
          }
        }, 0);
      })
    );

    // Track current route
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentRoute = event.url;
          
          // Check authentication on route change (but allow auth-success and login)
          const isAuth = this.authService.isAuthenticated();
          if (!isAuth && !event.url.includes('/auth-success') && !event.url.includes('/login') && event.url !== '/') {
            this.router.navigate(['/login']);
          }
        })
    );

    // TEMPORARY: Disable initial auth redirect to fix auth-success flow
    // Authentication will be handled by route guards and auth-success component
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still redirect to login even if logout fails
        this.router.navigate(['/login']);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
