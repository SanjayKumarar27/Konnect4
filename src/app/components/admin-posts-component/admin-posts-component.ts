// src/app/components/admin/admin-posts/admin-posts.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-admin-posts',
  templateUrl: './admin-posts-component.html',
  styleUrls: ['./admin-posts-component.css'],
  standalone: false
})
export class AdminPostsComponent implements OnInit {
  adminUserId: number = 0;
  posts: any[] = [];
  filteredPosts: any[] = [];
  loading: boolean = true;
  searchQuery: string = '';
  selectedPost: any = null;
  showPostDetail: boolean = false;

  // NEW: For floating label
  hasSearchText: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAdminAccess();
    this.loadPosts();
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

  loadPosts() {
    this.loading = true;
    this.adminService.getAllPosts(this.adminUserId).subscribe({
      next: (data) => {
        this.posts = data;
        this.filteredPosts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.loading = false;
      }
    });
  }

  // UPDATED: Called on every input change
  onSearchInput(value: string) {
    this.searchQuery = value;
    this.hasSearchText = value.trim().length > 0;
    this.filterPosts();
  }

  filterPosts() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredPosts = this.posts.filter(p =>
      p.content.toLowerCase().includes(query) ||
      p.username.toLowerCase().includes(query)
    );
  }

  selectPost(post: any) {
    this.selectedPost = post;
    this.showPostDetail = true;
  }

  closeDetail() {
    this.showPostDetail = false;
    this.selectedPost = null;
  }

  deletePost(post: any) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    this.adminService.deletePost(post.postId, this.adminUserId).subscribe({
      next: () => {
        alert('Post deleted successfully');
        this.posts = this.posts.filter(p => p.postId !== post.postId);
        this.filterPosts();
        this.closeDetail();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}