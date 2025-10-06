import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FollowDto {
  targetUserId: number;
}

export interface FollowActionDto {
  requestId: number;
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'https://localhost:7214/api/Follow'; // adjust base URL

  constructor(private http: HttpClient) {}

  followUser(followerUserId: number, dto: FollowDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/follow/${followerUserId}`, dto);
  }

  unfollowUser(followerUserId: number, dto: FollowDto): Observable<any> {
    return this.http.delete(`${this.apiUrl}/unfollow/${followerUserId}`, {
      body: dto
    });
  }

  acceptFollowRequest(userId: number, dto: FollowActionDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${userId}`, dto);
  }

  followBack(userId: number, dto: FollowDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/followback/${userId}`, dto);
  }
}
