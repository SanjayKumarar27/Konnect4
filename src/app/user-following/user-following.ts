import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FollowService } from '../services/follw-service';

@Component({
  selector: 'k4-user-following',
  standalone: false,
  templateUrl: './user-following.html',
  styleUrl: './user-following.css'
})
export class UserFollowing implements OnInit {
userId: number = 0;
following: FollowUserDto[] = [];
loading = true;
currentUserId: number = 0;

constructor(
private route: ActivatedRoute,
private followService: FollowService
) {}

ngOnInit() {
this.loadCurrentUser();
this.userId = Number(this.route.snapshot.paramMap.get('id'));
this.loadFollowing();
}

loadCurrentUser() {
const storedUser = localStorage.getItem('user');
if (storedUser) {
this.currentUserId = JSON.parse(storedUser).userId;
}
}

loadFollowing() {
this.loading = true;
this.followService.getFollowing(this.userId).subscribe({
next: (data) => {
this.following = data;
this.loading = false;
},
error: (err) => {
console.error('Error loading following:', err);
this.loading = false;
}
});
}
}