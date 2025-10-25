import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user';
import { FollowService } from '../../services/follw-service';
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
    private fb: FormBuilder
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
        this.profile!.isFollowing = true; // Update UI
        this.profile!.followersCount++; // Increment count
      },
      error: (err) => console.error('Follow error:', err)
    });
  }

  unfollow() {
    if (!this.userId || !this.profile) return;
    this.followService.unfollowUser(this.currentUserId, { targetUserId: this.userId }).subscribe({
      next: (res) => {
        this.profile!.isFollowing = false; // Update UI
        this.profile!.followersCount--; // Decrement count
      },
      error: (err) => console.error('Unfollow error:', err)
    });
  }
}