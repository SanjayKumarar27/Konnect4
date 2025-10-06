import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  // Define the posts property with full type safety
  posts: Post[] = [
    {
      userProfile: { username: 'raghu', profileImageUrl: 'https://tse2.mm.bing.net/th/id/OIP.Zf9VwVoSwuBY2L2VLlwNLQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3' },
      content: 'Welcome to Konnect-4! This is your first post.',
      imageUrl: 'https://static.vecteezy.com/system/resources/previews/020/011/332/original/aesthetic-enjoy-the-nature-quotes-facebook-post-free-editor_template.jpeg',
      createdAt: new Date().toISOString()
    }
  ];
}
