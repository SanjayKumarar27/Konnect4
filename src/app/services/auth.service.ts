// src/app/services/auth.service.ts
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
  private userRole = new BehaviorSubject<string>('User'); // ✅ NEW

  constructor(private http: HttpClient) {
    this.loggedIn.next(!!localStorage.getItem('user'));
    this.loadUserRole(); // ✅ NEW
  }

  // ✅ NEW: Load user role from localStorage
  private loadUserRole() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole.next(user.role || 'User');
    }
  }

  // ✅ NEW: Get user role observable
  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  // ✅ NEW: Get current user role synchronously
  getCurrentRole(): string {
    return this.userRole.value;
  }

  /** Check authentication */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  /** Login with backend */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.user) {
          // ✅ UPDATED: Include role in localStorage
          localStorage.setItem('user', JSON.stringify({
            userId: response.user.userId,
            email: response.user.email,
            username: response.user.username,
            fullName: response.user.fullName,
            role: response.user.role || 'User' // ✅ NEW: Store role
          }));
          
          this.loggedIn.next(true);
          this.userRole.next(response.user.role || 'User'); // ✅ NEW
          
          console.log('AuthService: Login successful', response.user);
          console.log('User role:', response.user.role); // ✅ NEW: Debug log
        }
      })
    );
  }

  /** Register new user */
  register(userData: { username: string; email: string; password: string; fullName?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        console.log('AuthService: Registration successful', response);
      })
    );
  }

  /** Logout */
  logout() {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.userRole.next('User'); // ✅ NEW
    console.log('AuthService: Logged out');
  }

  /** Get current logged-in user */
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ✅ NEW: Check if current user is admin
  isAdmin(): boolean {
    return this.getCurrentRole() === 'Admin';
  }
}