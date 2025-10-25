import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private apiUrl = 'https://localhost:7214/api/AdminAuth'; // ✅ your backend base URL

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('adminToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  logout() {
    localStorage.removeItem('adminToken');
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
