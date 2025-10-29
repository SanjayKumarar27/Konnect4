import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

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

  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}`);
  }
  // https://localhost:7214/api/Posts/14?userId=1
  updatePost(postId: number, data: any, userId: number): Observable<any> {
    console.log('Updating post with ID:', postId);
    console.log('Data:', data);
    console.log('User ID:', userId);
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
    return this.http.delete<any>(`${this.apiUrl}/Comments/${commentId}?userId=${userId}`);
    // https://localhost:7214/api/Comments/29?userId=7
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, data);
  }
  deletepost(postId: number,userId: number){
    return this.http.delete(`${this.apiUrl}/posts/${postId}?userId=${userId}`)
  }
}
