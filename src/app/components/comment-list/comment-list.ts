import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-comment-list',
  standalone: false,
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css'
})
export class CommentsList implements OnInit {
  comments: any[] = [];
  newComment: string = '';
  postId!: number;
  userId!: number; // Will be loaded from localStorage

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit() {
    this.loadUserId();
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
    console.log('Post ID:', this.postId);
  }

  loadUserId() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.userId;
      console.log('Logged-in userId:', this.userId);
    } else {
      console.error('No user found in localStorage. Redirecting to login.');
      // Optional: redirect to login
      // window.location.href = '/login';
    }
  }

  loadComments() {
    if (!this.postId) return;
    this.postService.getComments(this.postId).subscribe((data: any[]) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.userId || !this.newComment.trim()) return;

    const dto = { postId: this.postId, userId: this.userId, content: this.newComment.trim() };
    this.postService.addComment(dto).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }
}
