import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { UserService } from './user';
import { UserList } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private userService: UserService) {}

  getSuggestions(query: string): Observable<UserList[]> {
    if (!query || query.trim().length < 1) return of([]);
    const q = query.toLowerCase();
    return this.userService.getUsersList().pipe(
      switchMap(list =>
        of(list
          .filter(u => 
            u.username.toLowerCase().includes(q) || 
            (u.fullName && u.fullName.toLowerCase().includes(q))
          )
          .slice(0, 8)
        )
      ),
      catchError(() => of([]))
    );
  }
}
