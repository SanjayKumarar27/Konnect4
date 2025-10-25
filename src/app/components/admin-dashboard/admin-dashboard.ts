import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminAuthService } from '../../services/admin-auth.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone:false
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  selectedUserPosts: any[] = [];
  selectedUserName: string | null = null;

  constructor(private adminService: AdminService, private auth: AdminAuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe((res: any) => {
      this.users = res;
    });
  }

  viewUserPosts(user: any) {
    this.selectedUserName = user.username;
    this.adminService.getUserPosts(user.userId).subscribe((res: any) => {
      this.selectedUserPosts = res;
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe(() => this.loadUsers());
    }
  }

  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.adminService.deletePost(postId).subscribe(() =>
        this.selectedUserPosts = this.selectedUserPosts.filter(p => p.postId !== postId)
      );
    }
  }

  logout() {
    this.auth.logout();
  }
}
