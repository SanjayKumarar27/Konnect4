import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7214/api/auth'; // ✅ Your backend AuthController URL
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loggedIn.next(!!localStorage.getItem('user'));
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
          localStorage.setItem('user', JSON.stringify(response.user));
          this.loggedIn.next(true);
          console.log('AuthService: Login successful', response.user);
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
    console.log('AuthService: Logged out');
  }

  /** Get current logged-in user */
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
