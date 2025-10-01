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
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
