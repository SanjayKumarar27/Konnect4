// src/app/components/topbar/topbar.ts
import { Component, OnInit } from '@angular/core';
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
export class TopbarComponent implements OnInit {
  query = '';
  suggestions: UserList[] = [];
  userId!: number;
  userRole: string = 'User'; // ✅ NEW: Track role
  username: string = ''; // ✅ NEW: Track username
  private q$ = new Subject<string>();

  constructor(private searchService: SearchService, private router: Router) {
    this.q$.pipe(debounceTime(250)).subscribe(q => this.fetch(q));
    this.loadUserInfo();
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  // ✅ NEW: Load user info including role
  loadUserInfo() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.userId;
      this.username = user.username;
      this.userRole = user.role || 'User';
      console.log('Topbar - User role:', this.userRole);
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile', this.userId]);
  }

  // ✅ NEW: Check if user is admin
  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  // ✅ NEW: Go to admin dashboard
  goToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}