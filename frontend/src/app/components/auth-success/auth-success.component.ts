import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-success',
  imports: [CommonModule],
  templateUrl: './auth-success.component.html',
  styleUrl: './auth-success.component.css'
})
export class AuthSuccessComponent implements OnInit {
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (token) {
        try {
          this.authService.handleAuthSuccess(token);
          this.isLoading = false;
          
          // Redirect to main app after token is processed
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        } catch (error) {
          console.error('Authentication error:', error);
          this.error = 'Authentication failed. Please try again.';
          this.isLoading = false;
        }
      } else {
        this.error = 'No authentication token received.';
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}