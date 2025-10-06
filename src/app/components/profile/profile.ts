import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user';
import { UserProfile, UpdateProfile } from '../../models/user';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  param: string | null = null;
  userId: number | null = null;
  profile?: UserProfile;
  form: FormGroup;
  saving = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
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
    this.param = this.route.snapshot.paramMap.get('id');
    if (!this.param) { this.loadById(1); return; }

    const asNum = Number(this.param);
    if (!isNaN(asNum) && asNum > 0) {
      this.loadById(asNum);
    } else {
      // username provided -> attempt to resolve by checking users list and then checking IDs
      this.userService.getUsersList().subscribe(list => {
        const found = list.find(u => u.username.toLowerCase() === (this.param || '').toLowerCase());
        if (found) {
          this.findIdByUsername(this.param || '').then(id => {
            if (id) this.loadById(id);
            else { this.loading = false; alert('Could not resolve username to id'); }
          });
        } else {
          this.loading = false;
          alert('User not found in users list.');
        }
      }, err => { this.loading = false; alert('Unable to fetch user list'); });
    }
  }

  async findIdByUsername(username: string): Promise<number | null> {
    // Best-effort: probe small ID range. Replace with a backend endpoint if possible.
    const MAX = 200;
    for (let i = 1; i <= MAX; i++) {
      try {
        const resp: any = await lastValueFrom(this.userService.getUserById(i));
        if (resp && ((resp.username && resp.username.toLowerCase() === username.toLowerCase())
            || (resp.userId && resp.userId === i))) {
          return resp.userId ?? i;
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  }

  loadById(id: number) {
    this.loading = true;
    this.userService.getUserProfile(id).subscribe(profile => {
      this.profile = profile;
      this.userId = id;
      this.form.patchValue({
        fullName: profile.fullName,
        bio: profile.bio,
        profileImageUrl: profile.profileImageUrl,
        isPrivate: (profile as any).isPrivate ?? false
      });
      this.loading = false;
    }, err => {
      this.loading = false;
      alert('Failed to load profile. Confirm id exists.');
    });
  }

  save() {
    if (!this.userId) { alert('User id not resolved. Cannot save.'); return; }
    this.saving = true;
    const dto: UpdateProfile = {
      fullName: this.form.value.fullName,
      bio: this.form.value.bio,
      profileImageUrl: this.form.value.profileImageUrl,
      isPrivate: this.form.value.isPrivate
    };
    this.userService.updateProfile(this.userId, dto).subscribe(res => {
      this.saving = false;
      alert('Profile updated successfully.');
      this.loadById(this.userId as number);
    }, err => {
      this.saving = false;
      alert('Failed to update profile.');
    });
  }
}
