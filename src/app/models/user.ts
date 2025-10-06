export interface Post {
  postId: number;
  content?: string;
  imageUrl?: string;
  createdAt: string; // ISO
}

export interface UserProfile {
  userId: number;
  username: string;
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  posts: Post[];
}

export interface UpdateProfile {
  fullName?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  isPrivate?: boolean | null;
}

export interface UserList {
  userId: number;  
  username: string;
  fullName: string;
  profileImageUrl?: string;
}

// models/user.ts
export interface UserListS {
  username: string;
  fullName: string;
  profileImageUrl?: string;
}
