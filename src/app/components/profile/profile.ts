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
  userId: number | null = null;
  profile?: UserProfile;
  form: FormGroup;
  saving = false;
  loading = true;

  showEditForm = false;
  isCurrentUser = false;
  currentUserId: number = 0; // will be fetched from localStorage

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
    }
  }

  loadById(id: number) {
    this.loading = true;
    this.userService.getUserProfile(id).subscribe(profile => {
      this.profile = profile;
      this.userId = id;
      this.isCurrentUser = this.currentUserId === id;

      // Patch edit form
      this.form.patchValue({
        fullName: profile.fullName,
        bio: profile.bio,
        profileImageUrl: profile.profileImageUrl,
        isPrivate: (profile as any).isPrivate ?? false
      });

      this.loading = false;
    });
  }

  toggleEdit() {
    this.showEditForm = !this.showEditForm;
  }

  save() {
    if (!this.userId) return;
    this.saving = true;
    const dto: UpdateProfile = this.form.value;
    this.userService.updateProfile(this.userId, dto).subscribe(res => {
      this.saving = false;
      this.showEditForm = false;
      this.loadById(this.userId!);
    });
  }

  follow() {
    if (!this.userId || !this.profile) return;
    this.followService.followUser(this.currentUserId, { targetUserId: this.userId }).subscribe(res => {
      alert(res.message);
      // Update profile object so template reacts
      this.profile!.isFollowing = true;
      this.profile!.followersCount++; // optional: increment followers count dynamically
    });
  }

  unfollow() {
    if (!this.userId || !this.profile) return;
    this.followService.unfollowUser(this.currentUserId, { targetUserId: this.userId }).subscribe(res => {
      alert(res.message);
      // Update profile object so template reacts
      this.profile!.isFollowing = false;
      this.profile!.followersCount--; // optional: decrement followers count dynamically
    });
  }
}
