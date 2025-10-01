import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  googleId: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!token && !!user;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Store token and user info
  setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    this.currentUserSubject.next(user);
  }

  // Clear auth data
  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  // Load user from stored token
  private loadStoredUser(): void {
    const token = this.getToken();
    if (token) {
      this.getCurrentUserInfo().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          } else {
            this.clearAuthData();
          }
        },
        error: () => {
          this.clearAuthData();
        }
      });
    }
  }

  // Get current user info from server
  getCurrentUserInfo(): Observable<AuthResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`, { headers });
  }

  // Login with Google (redirect to backend)
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  // Handle successful authentication (called from auth-success component)
  handleAuthSuccess(token: string): void {
    // Decode token to get user info (basic implementation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const user: User = {
        googleId: payload.googleId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
      
      this.setAuthData(token, user);
    } catch (error) {
      console.error('❌ Error parsing token:', error);
      this.clearAuthData();
    }
  }

  // Logout
  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  // Get auth headers for API requests
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
