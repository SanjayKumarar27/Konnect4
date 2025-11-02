// src/app/interceptors/jwt.interceptor.ts - FIXED
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // ✅ Get JWT token from localStorage
    const token = this.getToken();

    // ✅ If token exists, clone request and add Authorization header
    if (token) {
      request = this.addToken(request, token);
    }

    // ✅ Pass request to next interceptor/handler
    return next.handle(request).pipe(
      // ✅ Handle errors
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, request, next);
      })
    );
  }

  /**
   * Get JWT token from localStorage
   */
  private getToken(): string | null {
    const tokenData = localStorage.getItem('auth_token');
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        return parsed.token || null;
      } catch {
        return tokenData; // If plain string token, return as is
      }
    }
    return null;
  }

  /**
   * Clone request and add Authorization header with token
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    console.log('✅ Adding JWT token to request:', request.url);
    
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (error.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be invalid or expired');

      // ✅ Try to refresh token
      const token = this.getToken();
      if (token) {
        console.log('🔄 Attempting to refresh token...');
        
        // ✅ FIX: Use proper type handling with switchMap
        return this.authService.refreshToken(token).pipe(
          switchMap((response: any) => {
            console.log('✅ Token refreshed successfully');
            // The authService's refreshToken method already stores the new token.
            const newToken = this.authService.getCurrentToken();
            
            // ✅ Retry original request with new token
            return next.handle(this.addToken(request, newToken!));
          }),
          catchError((refreshError) => {
            console.error('❌ Token refresh failed - Logging out');
            this.logout();
            return throwError(() => error);
          })
        );
      } else {
        // No token available, logout
        this.logout();
        return throwError(() => error);
      }
    } else if (error.status === 403) {
      console.error('❌ 403 Forbidden - Access denied');
      this.router.navigate(['/home']);
      return throwError(() => error);
    } else if (error.status === 0) {
      console.error('❌ Network error - Check if backend is running');
    } else {
      console.error(`❌ HTTP Error: ${error.status} ${error.statusText}`);
    }

    return throwError(() => error);
  }

  /**
   * Store JWT token in localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem('auth_token', JSON.stringify({ token }));
    console.log('✅ Token stored in localStorage');
  }

  /**
   * Logout and clear token
   */
  private logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    console.log('🚪 User logged out - Redirected to login');
  }
}