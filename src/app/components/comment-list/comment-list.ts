import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.html',
  styleUrls: ['./comment-list.css'],
  standalone:false
})
export class CommentList implements OnInit {
  comments: any[] = [];
  newComment: string = '';
  userId!: number;
  
  @Input() postId!: number; 
   @Input() postOwnerId!: number; 
   @Output() commentsChanged = new EventEmitter<number>(); // <-- emit to parent

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadUserId();

    if (this.postId) {
      console.log('Post ID from parent:', this.postId);
      this.loadComments();
    }
  }

  private loadUserId(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.userId;
      console.log('Logged-in userId:', this.userId);
    }
  }

  loadComments(): void {
    if (!this.postId) return;
    this.postService.getComments(this.postId).subscribe({
      next: (data: any[]) => {
        this.comments = data;
         this.commentsChanged.emit(this.comments.length); // notify parent
      },
      error: (err) => {
        console.error('Failed to load comments:', err);
      }
    });
  }

  addComment(): void {
    const trimmedComment = this.newComment.trim();
    if (!this.userId || !trimmedComment) return;

    const dto = {
      postId: this.postId,
      userId: this.userId,
      content: trimmedComment
    };

    this.postService.addComment(dto).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments(); // reload after posting
      },
      error: (err) => {
        console.error('Failed to add comment:', err);
      }
    });
  }
  canDeleteComment(comment: any): boolean {
  const storedUser = localStorage.getItem('user');
  // console.log(storedUser)
  if (!storedUser) return false;

  const userId = JSON.parse(storedUser).userId;
  
  // Only allow deleting own comments
  return comment.userId === userId;
}


  // Delete comment
  deleteComment(commentId: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.postService.deleteComment(commentId, this.userId).subscribe({
      next: () => this.loadComments(),
      error: (err) => alert(err.error || 'Failed to delete comment')
    });
  }
}
