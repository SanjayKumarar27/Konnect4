import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PostService } from '../../services/post-service';
import { catchError, of } from 'rxjs';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';
interface Category {
  id: string;
  label: string;
}

@Component({
  selector: 'k4-explore',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {

  categories: Category[] = [
    { id: 'all', label: 'All' },
    { id: 'sports', label: 'Sports' },
    { id: 'politics', label: 'Politics' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'tech', label: 'Technology' },
    { id: 'food', label: 'Food' }
  ];
  selectedCategory = 'all';
  posts: Post[] =[];
  loading = true;
  error = '';

  constructor(
    private postService: PostService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) {    
  }
   toggleComments(post: any) {
    console.log(post.showComments)
    post.showComments = !post.showComments;
  }
  updateCommentsCount(post: any, newCount: number) {
  post.commentsCount = newCount;
}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = '';
    const cat = this.selectedCategory === 'all' ? '' : this.selectedCategory;

    this.postService.getExplorePosts(cat).pipe(
      catchError(err => {
        this.error = 'Failed to load posts';
        this.loading = false;
        this.cdr.markForCheck();
        return of([]);
      })
    ).subscribe(posts => {
      this.posts = posts.map(p => ({ ...p, liked: false }));
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  onCategoryChange(catId: string): void {
    this.selectedCategory = catId;
    this.loadPosts();
  }

  toggleLike(post: Post): void {
    const userId = this.currentUserId();
    if (!userId) return;

    if (!post.liked) {
      this.postService.likePost({ userId, postId: post.postId }).subscribe(() => {
        post.liked = true;
        post.likesCount= (post.likesCount ?? 0) + 1;;
        this.cdr.markForCheck();
      });
    } else {
      this.postService.unlikePost(post.postId, userId).subscribe(() => {
        post.liked = false;
        post.likesCount= (post.likesCount ?? 0) - 1;;
        this.cdr.markForCheck();
      });
    }
  }

  goToProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  private currentUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.userId || 0;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}


