import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FollowService } from '../services/follw-service';

@Component({
  selector: 'k4-user-follwer',
  standalone: false,
  templateUrl: './user-follwer.html',
  styleUrl: './user-follwer.css'
})
export class UserFollwer implements OnInit{
userId: number = 0;
followers: FollowUserDto[] = [];
loading = true;
currentUserId: number = 0;

constructor(
private route: ActivatedRoute,
private followService: FollowService
) {}

ngOnInit() {
this.loadCurrentUser();
this.userId = Number(this.route.snapshot.paramMap.get('id'));
this.loadFollowers();
}

loadCurrentUser() {
const storedUser = localStorage.getItem('user');
if (storedUser) {
this.currentUserId = JSON.parse(storedUser).userId;
}
}

loadFollowers() {
this.loading = true;
this.followService.getFollowers(this.userId).subscribe({
next: (data) => {
this.followers = data;
this.loading = false;
console.log(data)
},
error: (err) => {
console.error('Error loading followers:', err);
this.loading = false;
}
});
}
}

