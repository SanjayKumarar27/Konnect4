import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Post } from '../models/post.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://localhost:7214/api';  // Adjust your backend URL

  constructor(private http: HttpClient) {}

  createPost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, data);
  }

  // ✅ UPDATED: The backend gets the user ID from the token, so it's not needed in the URL.
  getFeed(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/feed/${userId}`);
  }
  
  getPostById(postId: number, userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}?userId=${userId}`);
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
    return this.http.delete<any>(`${this.apiUrl}/Comments/${commentId}?userId=${userId}`);
    // https://localhost:7214/api/Comments/29?userId=7
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, data);
  }
  deletepost(postId: number,userId: number){
    return this.http.delete(`${this.apiUrl}/posts/${postId}?userId=${userId}`)
  }
  getExplorePosts(category: string = ''): Observable<Post[]> {
    const url = category
      ? `${this.apiUrl}/posts/explore?category=${encodeURIComponent(category)}`
      : `${this.apiUrl}/posts/explore`;
    return this.http.get<Post[]>(url).pipe(
      catchError(this.handleError)
    );
  }

   private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      message = error.error?.message || `Error ${error.status}: ${error.message}`;
    }
    console.error('PostService Error:', message);
    return throwError(() => new Error(message));
  }
}
