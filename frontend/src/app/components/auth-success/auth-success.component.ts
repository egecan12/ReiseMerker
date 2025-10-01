import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-success',
  imports: [CommonModule],
  template: `
    <div class="auth-success-container">
      <div class="auth-success-card">
        <div class="success-icon">✅</div>
        <h2>Authentication Successful!</h2>
        <p>You have been successfully logged in.</p>
        <div class="loading" *ngIf="isLoading">
          <p>Redirecting...</p>
        </div>
        <div class="error" *ngIf="error">
          <p>{{ error }}</p>
          <button (click)="goToLogin()" class="retry-btn">Try Again</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-success-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 100%;
    }

    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
      font-size: 24px;
    }

    p {
      color: #666;
      margin-bottom: 20px;
      font-size: 16px;
    }

    .loading {
      color: #667eea;
    }

    .error {
      color: #e74c3c;
    }

    .retry-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }

    .retry-btn:hover {
      background: #5a6fd8;
    }
  `]
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
    console.log('🔐 AuthSuccess component initialized');
    this.route.queryParams.subscribe(params => {
      console.log('🔐 Query params:', params);
      const token = params['token'];
      
      if (token) {
        console.log('🔐 Token received:', token.substring(0, 50) + '...');
        try {
          this.authService.handleAuthSuccess(token);
          this.isLoading = false;
          
          // Wait for auth state to update, then redirect
          setTimeout(() => {
            console.log('🔐 Redirecting to main app...');
            this.router.navigate(['/']);
          }, 2000);
        } catch (error) {
          console.error('❌ Auth success error:', error);
          this.error = 'Authentication failed. Please try again.';
          this.isLoading = false;
        }
      } else {
        console.log('❌ No token in query params');
        this.error = 'No authentication token received.';
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
