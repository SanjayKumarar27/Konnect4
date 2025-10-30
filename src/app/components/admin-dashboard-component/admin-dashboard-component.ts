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
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  goToAllPosts() {
    this.router.navigate(['/admin/posts']);
  }
}