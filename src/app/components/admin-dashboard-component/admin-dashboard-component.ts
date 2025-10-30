// src/app/components/admin/admin-dashboard/admin-dashboard.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  adminUserId: number = 0;
  isAdmin: boolean = false;
  loading: boolean = true;

  dashboard: any = {
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    activeUsersToday: 0,
    recentUsers: [],
    recentPosts: []
  };

  // SORT STATE FOR USERS TABLE
  sortColumn: 'username' | 'postsCount' | 'followersCount' | 'createdAt' = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAdminAccess();
    this.loadDashboard();
  }

  checkAdminAccess() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.adminUserId = user.userId;
      this.isAdmin = user.role === 'Admin';

      if (!this.isAdmin) {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadDashboard() {
    this.loading = true;
    this.adminService.getDashboard(this.adminUserId).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.sortUsers();  // Apply default sort (newest first)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }

  // SORT BY COLUMN
  sortBy(column: 'username' | 'postsCount' | 'followersCount' | 'createdAt') {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsers();
  }

  // APPLY SORT TO recentUsers
  private sortUsers() {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    this.dashboard.recentUsers.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Username: alphabetical
      if (this.sortColumn === 'username') {
        const nameA = (valA || '').toString().toLowerCase();
        const nameB = (valB || '').toString().toLowerCase();
        return dir * nameA.localeCompare(nameB);
      }

      // Numbers: Posts, Followers
      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir * (valA - valB);
      }

      // Fallback
      return 0;
    });
  }
  // === POSTS SORT STATE ===
postSortColumn: 'username' | 'likesCount' | 'commentsCount' | 'createdAt' = 'createdAt';
postSortDir: 'asc' | 'desc' = 'desc';

// === POSTS SORT METHOD ===
sortPostsBy(column: 'username' | 'likesCount' | 'commentsCount' | 'createdAt') {
  if (this.postSortColumn === column) {
    this.postSortDir = this.postSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    this.postSortColumn = column;
    this.postSortDir = 'asc';
  }
  this.sortPosts();
}

// === APPLY SORT TO recentPosts ===
private sortPosts() {
  const dir = this.postSortDir === 'asc' ? 1 : -1;
  this.dashboard.recentPosts.sort((a: any, b: any) => {
    let A = a[this.postSortColumn], B = b[this.postSortColumn];
    if (this.postSortColumn === 'username') {
      A = (A || '').toString().toLowerCase();
      B = (B || '').toString().toLowerCase();
      return dir * A.localeCompare(B);
    }
    return dir * (A - B);
  });
}

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  goToAllPosts() {
    this.router.navigate(['/admin/posts']);
  }
}