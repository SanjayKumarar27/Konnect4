// user.ts (UserService)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserList } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7214/api/users';

  constructor(private http: HttpClient) {}

  getUsersList(): Observable<UserList[]> {
    return this.http.get<UserList[]>(this.apiUrl);
  }
}
