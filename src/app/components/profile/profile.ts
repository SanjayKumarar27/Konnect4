import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user';
import { FollowService } from '../../services/follw-service';
import { PostService } from '../../services/post-service'; // Import PostService
import { UserProfile, UpdateProfile } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  param: string | null = null;
  userId: number | null = null; // Fixed: Added userId
  profile?: UserProfile;
  form: FormGroup;
  saving = false;
  loading = true;
  showEditForm = false;
  isCurrentUser = false;
  currentUserId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService,
    private fb: FormBuilder,
    private postService: PostService, // Inject PostService
    private router: Router // Inject Router
  ) {
    this.form = this.fb.group({
      fullName: [''],
      bio: [''],
      profileImageUrl: [''],
      isPrivate: [false]
    });
  }

  ngOnInit() {
    this.loadCurrentUser();
    this.param = this.route.snapshot.paramMap.get('id');
    const idToLoad = this.param ? Number(this.param) : this.currentUserId;
    if (!isNaN(idToLoad) && idToLoad > 0) {
      this.userId = idToLoad; // Fixed: Set userId
      this.loadById(idToLoad);
    }
  }

  loadCurrentUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserId = user.userId;
    } else {
      console.error('No user found in localStorage. Redirect to login.');
      // Optionally redirect to login page
      // this.router.navigate(['/login']);
    }
  }

  loadById(id: number) {
    this.loading = true;
    this.userService.getUserProfile(id).subscribe({
      next: (profile) => {
        this.profile = profile;
        if (this.profile.posts) {
          this.profile.posts.forEach(p => p.showOptions = false);
        }
        console.log(profile);
        this.isCurrentUser = this.currentUserId === id;
        this.form.patchValue({
          fullName: profile.fullName,
          bio: profile.bio,
          profileImageUrl: profile.profileImageUrl,
          isPrivate: profile.isPrivate ?? false
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.showEditForm = !this.showEditForm;
  }

  save() {
    if (!this.currentUserId) return;
    this.saving = true;
    const dto: UpdateProfile = this.form.value;
    this.userService.updateProfile(this.currentUserId, dto).subscribe({
      next: () => {
        this.saving = false;
        this.showEditForm = false;
        this.loadById(this.currentUserId); // Refresh profile
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.saving = false;
      }
    });
  }

  follow() {
    if (!this.userId || !this.profile) return;
    this.followService.followUser(this.currentUserId, { targetUserId: this.userId }).subscribe({
      next: (res) => {
        if (this.profile) {
          this.profile.isFollowing = true; // Update UI
          this.profile.followersCount++; // Increment count
        }
      },
      error: (err) => console.error('Follow error:', err)
    });
  }

  unfollow() {
    if (!this.userId || !this.profile) return;
    this.followService.unfollowUser(this.currentUserId, { targetUserId: this.userId }).subscribe({
      next: (res) => {
        if (this.profile) {
          this.profile.isFollowing = false; // Update UI
          this.profile.followersCount--; // Decrement count
        }
      },
      error: (err) => console.error('Unfollow error:', err)
    });
  }

  editPost(postId: number) {
    // Navigate to edit page
    this.router.navigate(['/update-post', postId]);
  }

  deletePost(postId: number) {
  const user = localStorage.getItem('user');
  if (!user) { alert('User not logged in'); return; }
  const currentUserId = JSON.parse(user).userId;

  this.postService.deletepost(postId, currentUserId).subscribe({
    next: (res: any) => {
      alert(res.message || 'Post deleted successfully.');
      // Remove the post from the UI
      if (this.profile && this.profile.posts) {
        this.profile.posts = this.profile.posts.filter(p => p.postId !== postId);
      }
     
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

}