import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { debounceTime, Subject } from 'rxjs';

import { UserList } from '../../models/user';
import { SearchService } from '../../services/search';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
  query = '';
  suggestions: UserList[] = [];
  private q$ = new Subject<string>();

  constructor(private searchService: SearchService, private router: Router) {
    this.q$.pipe(debounceTime(250)).subscribe(q => this.fetch(q));
  }

  onInput() {
    this.q$.next(this.query);
  }

  fetch(q: string) {
    if (!q || q.trim().length === 0) {
      this.suggestions = [];
      return;
    }
    this.searchService.getSuggestions(q).subscribe(res => this.suggestions = res);
  }

  selectSuggestion(s: UserList) {
    // navigate to profile route with username (Profile component resolves username -> id)
    this.router.navigate(['/profile', s.username]);
    this.suggestions = [];
    this.query = '';
  }

  onLogout() {
    // Implement auth logout later — frontend placeholder:
    alert('Logged out (frontend stub)');
    this.router.navigate(['/']);
  }
}
