import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SearchService } from '../../services/search';
import { UserList } from '../../models/user';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css'],
  standalone:false
})
export class TopbarComponent {
  query = '';
  suggestions: UserList[] = [];
  userId!: number;
  private q$ = new Subject<string>();

  constructor(private searchService: SearchService, private router: Router) {
    this.q$.pipe(debounceTime(250)).subscribe(q => this.fetch(q));
    this.loadUserId();
  }

  loadUserId() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.userId;
      console.log('Logged-in userId:', this.userId);
    } else {
      console.log('No user found in localStorage.');
    }
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
    this.router.navigate(['/profile', s.username]);
    this.suggestions = [];
    this.query = '';
  }

  onLogout() {
    // Implement auth logout later — frontend placeholder:
    localStorage.removeItem('user');  // remove the user details from localStorage
    alert('Logged out (frontend stub)');
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile', this.userId]);
  }
}
