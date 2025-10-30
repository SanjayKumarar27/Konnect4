// src/app/components/sidebar/sidebar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  open = true;
  userRole: string = 'User'; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserRole();
  }

  // ✅ NEW: Load user role from localStorage
  loadUserRole() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole = user.role || 'User';
      console.log('Sidebar user role:', this.userRole);
    }
  }

  toggle = () => { this.open = !this.open; }

  // User Navigation
  goHome = () => { this.router.navigate(['/home']); }
  goCreatePost = () => { this.router.navigate(['/create-post']); }
  goMessages = () => { this.router.navigate(['/chats']); }
  goExplore = () => { this.router.navigate(['/Explore']); }

  // ✅ NEW: Admin Navigation
  goAdminDashboard = () => { this.router.navigate(['/admin/dashboard']); }
  goAdminUsers = () => { this.router.navigate(['/admin/users']); }
  goAdminPosts = () => { this.router.navigate(['/admin/posts']); }

  // Logout
  logout = () => { 
    localStorage.clear();
    this.router.navigate(['/login']); 
  }

  // ✅ NEW: Check if user is admin
  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }
}