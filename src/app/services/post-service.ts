import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://localhost:7214/api';  // Adjust your backend URL

  constructor(private http: HttpClient) {}

  createPost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, data);
  }

  getFeed(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/feed/${userId}`);
  }

  updatePost(postId: number, data: any, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${postId}?userId=${userId}`, data);
  }

  likePost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/likes`, data);
  }

  unlikePost(postId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/likes?postId=${postId}&userId=${userId}`);
  }

  getComments(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/post/${postId}`);
  }
 deleteComment(commentId: number, userId: number): Observable<any> {
    // Pass userId as query parameter
    return this.http.delete<any>(`${this.apiUrl}/${commentId}?userId=${userId}`);
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, data);
  }
  deletepost(postId: number,userId: number){
    return this.http.delete(`${this.apiUrl}/posts/${postId}?userId=${userId}`)
  }
}
