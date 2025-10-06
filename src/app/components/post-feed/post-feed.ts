import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-post-feed',
  standalone: false,
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.css'
})
export class PostFeed implements OnInit {
  posts: any[] = [];
  userId = 1; // Replace with logged-in user

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    this.postService.getFeed(this.userId).subscribe((data: any[]) => {
      this.posts = data.map(post => ({ ...post, liked: false }));
    });
  }

  toggleLike(post: any) {
    if (!post.liked) {
      this.postService.likePost({ userId: this.userId, postId: post.postId }).subscribe(() => {
        post.liked = true;
        post.likesCount++;
      });
    } else {
      this.postService.unlikePost(post.postId, this.userId).subscribe(() => {
        post.liked = false;
        post.likesCount--;
      });
    }
  }

  // deletePost(post: any) {
  //   if (confirm("Are you sure you want to delete this post?")) {
  //     this.postService.deletepost(post.postId, this.userId).subscribe(() => {
  //       // Remove post from local feed after deletion
  //       this.posts = this.posts.filter(p => p.postId !== post.postId);
  //     });
  //   }
  // }
  deletePost(postId: number) {
  this.postService.deletepost(postId, this.userId).subscribe(() => {
    this.posts = this.posts.filter(p => p.postId !== postId);
  });
}


editPost(postId: number) {
  // Navigate to edit page
  window.location.href = `/update-post/${postId}`;
}
}
