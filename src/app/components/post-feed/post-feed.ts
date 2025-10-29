import { Component, Injector, OnInit } from '@angular/core';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-post-feed',
  standalone: false,
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.css'
})
export class PostFeed implements OnInit {
  posts: any[] = [];
    commentsComponent!:any;
  userId!:number;  // Replace with logged-in user

  constructor(private postService: PostService,private injector: Injector) {}
   toggleComments(post: any) {
    post.showComments = !post.showComments;
  }

  createInjector(postId: number) {
    return Injector.create({
      providers: [
        { provide: 'POST_ID', useValue: postId }
      ],
      parent: this.injector
    });
  }

 ngOnInit() {
  this.loadUserId();
}

updateCommentsCount(post: any, newCount: number) {
  post.commentsCount = newCount;
}


loadUserId() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    this.userId = user.userId;
    console.log('Logged-in userId:', this.userId);

    // Now load the feed
    this.loadFeed();
  } else {
    console.error('No user found in localStorage. Redirect to login.');
    // Optional: redirect to login page
    // window.location.href = '/login';
  }
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
  const user = localStorage.getItem('user');
  if (!user) { alert('User not logged in'); return; }
  const currentUserId = JSON.parse(user).userId;

  this.postService.deletepost(postId, currentUserId).subscribe({
    next: (res: any) => {
      alert(res.message || 'Post deleted successfully.');
      // Remove the post from the UI
      this.posts = this.posts.filter(p => p.postId !== postId);
      this.loadFeed();
    },
    error: (err: any) => {
      console.error(err);
      // Check if it's 401 Unauthorized
      if (err.status === 401) {
        alert(err.error || 'You cannot delete others post!');
      } else if (err.status === 404) {
        alert(err.error || 'Post not found!');
      } else {
        alert('Something went wrong while deleting the post.');
      }
    }
  });
}



editPost(postId: number) {
  // Navigate to edit page
  window.location.href = `/update-post/${postId}`;
}
}
