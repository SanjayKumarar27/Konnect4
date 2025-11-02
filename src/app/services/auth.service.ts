// src/app/services/auth.service.ts - UPDATED
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7214/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>('User');
  private token = new BehaviorSubject<string | null>(null); // ✅ NEW: Track token

  constructor(private http: HttpClient) {
    this.loggedIn.next(!!localStorage.getItem('user'));
    this.loadUserRole();
    this.loadToken();
  }

  // ✅ NEW: Load token from localStorage
  private loadToken(): void {
    const tokenData = localStorage.getItem('auth_token');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        this.token.next(parsed.token || null);
        console.log('✅ Token loaded from localStorage');
      } catch {
        const plainToken = tokenData;
        this.token.next(plainToken);
      }
    }
  }

  private loadUserRole() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole.next(user.role || 'User');
    }
  }

  // ✅ NEW: Get token observable
  getToken(): Observable<string | null> {
    return this.token.asObservable();
  }

  // ✅ NEW: Get current token synchronously
  getCurrentToken(): string | null {
    return this.token.value;
  }

  // ✅ NEW: Check if token exists and is valid
  hasValidToken(): boolean {
    const token = this.token.value;
    return token !== null && token !== undefined && token !== '';
  }

  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  getCurrentRole(): string {
    return this.userRole.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user') && this.hasValidToken();
  }

  /** Login with backend - ✅ UPDATED TO HANDLE JWT TOKEN */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.user && response.token) {
          // ✅ Store JWT token
          this.storeToken(response.token);

          // ✅ Store user info
          localStorage.setItem('user', JSON.stringify({
            userId: response.user.userId,
            email: response.user.email,
            username: response.user.username,
            fullName: response.user.fullName,
            role: response.user.role || 'User'
          }));

          this.loggedIn.next(true);
          this.userRole.next(response.user.role || 'User');
          this.token.next(response.token); // ✅ Update token BehaviorSubject

          console.log('✅ Login successful - JWT token stored');
          console.log('User role:', response.user.role);
        }
      })
    );
  }

  /** ✅ NEW: Refresh JWT token */
  refreshToken(currentToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, { token: currentToken }).pipe(
      tap((response) => {
        if (response.token) {
          this.storeToken(response.token);
          this.token.next(response.token);
          console.log('✅ Token refreshed successfully');
        }
      })
    );
  }

  /** ✅ NEW: Validate token with backend */
  validateToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate-token`, { token });
  }

  /** Register new user */
  register(userData: { username: string; email: string; password: string; fullName?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        console.log('AuthService: Registration successful', response);
      })
    );
  }

  /** ✅ NEW: Store JWT token in localStorage */
  private storeToken(token: string): void {
    localStorage.setItem('auth_token', JSON.stringify({ token }));
    console.log('✅ JWT token stored in localStorage');
  }

  /** Logout - ✅ UPDATED TO CLEAR TOKEN */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token'); // ✅ NEW: Remove token
    this.loggedIn.next(false);
    this.userRole.next('User');
    this.token.next(null); // ✅ NEW: Clear token BehaviorSubject
    console.log('🚪 Logged out - Token cleared');
  }

  /** Get current logged-in user */
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /** Check if current user is admin */
  isAdmin(): boolean {
    return this.getCurrentRole() === 'Admin';
  }
}