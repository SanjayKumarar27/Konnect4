import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserProfile, UpdateProfile, UserList } from '../models/user';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base = `${environment.apiBase}/Users`;

  constructor(private http: HttpClient) {}

  getUsersList(): Observable<UserList[]> {
    return this.http.get<UserList[]>(this.base);
  }

  getUserProfile(id: number): Observable<UserProfile> {
    const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').userId || 0;
    return this.http.get<UserProfile>(`${this.base}/${id}/profile?currentUserId=${currentUserId}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  updateProfile(id: number, dto: UpdateProfile) {
    return this.http.put(`${this.base}/${id}`, dto);
  }
}
