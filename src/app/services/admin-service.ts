// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7214/api/admin';

  constructor(private http: HttpClient) {}

  // Get admin dashboard statistics
  getDashboard(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard?userId=${userId}`);
  }

  // Get all users
  getAllUsers(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users?userId=${userId}`);
  }

  // Delete a user
  deleteUser(targetUserId: number, adminUserId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${targetUserId}?adminUserId=${adminUserId}`);
  }

  // Get all posts
  getAllPosts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts?userId=${userId}`);
  }

  // Delete a post
  deletePost(postId: number, adminUserId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}?adminUserId=${adminUserId}`);
  }
}