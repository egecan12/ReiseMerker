import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="app-logo">
          <h1>📍 Location Notebook</h1>
          <p>Track and manage your favorite locations</p>
        </div>
        
        <div class="login-content">
          <h2>Welcome Back!</h2>
          <p>Sign in with your Google account to access your personal location notebook.</p>
          
          <button (click)="loginWithGoogle()" class="google-login-btn" [disabled]="isLoading">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span *ngIf="!isLoading">Sign in with Google</span>
            <span *ngIf="isLoading">Signing in...</span>
          </button>
          
          <div class="features">
            <h3>What you can do:</h3>
            <ul>
              <li>📍 Save your favorite locations</li>
              <li>📸 Add photos to your locations</li>
              <li>🗺️ View locations on maps</li>
              <li>📱 Access from any device</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 450px;
      width: 100%;
    }

    .app-logo h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: bold;
    }

    .app-logo p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .login-content h2 {
      color: #333;
      margin-bottom: 10px;
      font-size: 24px;
    }

    .login-content > p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
      line-height: 1.5;
    }

    .google-login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 12px 24px;
      background: white;
      border: 2px solid #dadce0;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #3c4043;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 30px;
    }

    .google-login-btn:hover:not(:disabled) {
      border-color: #4285f4;
      box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
    }

    .google-login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .google-icon {
      width: 20px;
      height: 20px;
    }

    .features {
      text-align: left;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .features h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 18px;
    }

    .features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .features li {
      color: #666;
      margin-bottom: 8px;
      font-size: 14px;
    }
  `]
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    this.authService.loginWithGoogle();
  }
}
