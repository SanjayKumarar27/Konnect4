import { Component } from '@angular/core';


interface UserProfile {
  username: string;
  profileImageUrl?: string;
}

interface Post {
  userProfile?: UserProfile;
  content?: string;
  imageUrl?: string;
  createdAt: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  
}
