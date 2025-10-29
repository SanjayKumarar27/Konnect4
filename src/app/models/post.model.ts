
export interface Post {
  postId: number;
  userId: number;
  username: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  liked?: boolean;
  profileImageUrl?: string;
  category?: string;
}