// src/app/components/admin/admin-users/admin-users.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin-service';


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-user-component.html',
  styleUrls: ['./admin-user-component.css'],
  standalone: false
})
export class AdminUserComponent implements OnInit {
  adminUserId: number = 0;
  users: any[] = [];
  filteredUsers: any[] = [];
  loading: boolean = true;
  searchQuery: string = '';
  selectedUser: any = null;
  showUserProfile: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAdminAccess();
    this.loadUsers();
  }

  checkAdminAccess() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.adminUserId = user.userId;
      if (user.role !== 'Admin') {
        this.router.navigate(['/home']);
      }
    }
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers(this.adminUserId).subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.username.toLowerCase().includes(query) ||
      u.fullName.toLowerCase().includes(query)
    );
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.showUserProfile = true;
  }

  closeProfile() {
    this.showUserProfile = false;
    this.selectedUser = null;
  }

  deleteUser(user: any) {
    if (!confirm(`Are you sure you want to delete ${user.username}?`)) {
      return;
    }

    this.adminService.deleteUser(user.userId, this.adminUserId).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.users = this.users.filter(u => u.userId !== user.userId);
        this.filterUsers();
        this.closeProfile();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    });
  }
  onImageError(event: any) {
  event.target.src = 'assets/default-avatar.png';
}

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}