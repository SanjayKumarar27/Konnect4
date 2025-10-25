import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://localhost:7214/api/Admin';

  constructor(private http: HttpClient, private authService: AdminAuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllUsers() {
    return this.http.get(`${this.apiUrl}/users`, this.getAuthHeaders());
  }

  getUserPosts(userId: number) {
    return this.http.get(`${this.apiUrl}/users/${userId}/posts`, this.getAuthHeaders());
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, this.getAuthHeaders());
  }

  deletePost(postId: number) {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, this.getAuthHeaders());
  }
}
