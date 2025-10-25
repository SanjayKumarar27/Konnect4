import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PostService } from '../../services/post-service';
import { EmojiPicker } from '../emoji-picker/emoji-picker'; // your component

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.html',
  styleUrls: ['./comment-list.css'],
  standalone:false
})
export class CommentList implements OnInit, OnDestroy {
  comments: any[] = [];
  newComment = '';
  userId!: number;

  emojiInput$ = new BehaviorSubject<string>('');
  private emojiSub!: Subscription;

  @Input() postId!: number;
  @Input() postOwnerId!: number;
  @Output() commentsChanged = new EventEmitter<number>();

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadUserId();
    if (this.postId) this.loadComments();

    // ✅ Subscribe to emojiInput$ changes
    this.emojiSub = this.emojiInput$.subscribe((emoji) => {
      if (emoji) this.newComment += emoji;
    });
  }

  ngOnDestroy(): void {
    this.emojiSub?.unsubscribe();
  }

  private loadUserId(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.userId;
    }
  }

  loadComments(): void {
    if (!this.postId) return;
    this.postService.getComments(this.postId).subscribe({
      next: (data: any[]) => {
        this.comments = data;
        this.commentsChanged.emit(this.comments.length);
      },
      error: (err) => console.error('Failed to load comments:', err),
    });
  }

  addComment(): void {
    const trimmedComment = this.newComment.trim();
    if (!this.userId || !trimmedComment) return;

    const dto = { postId: this.postId, userId: this.userId, content: trimmedComment };

    this.postService.addComment(dto).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
      },
      error: (err) => console.error('Failed to add comment:', err),
    });
  }

  canDeleteComment(comment: any): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return false;
    const userId = JSON.parse(storedUser).userId;
    return comment.userId === userId;
  }

  deleteComment(commentId: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    this.postService.deleteComment(commentId, this.userId).subscribe({
      next: () => this.loadComments(),
      error: (err) => alert(err.error || 'Failed to delete comment'),
    });
  }
}
