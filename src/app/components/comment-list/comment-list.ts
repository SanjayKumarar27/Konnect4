import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-comment-list',
  standalone: false,
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css'
})
export class CommentsList implements OnInit {
  comments: any[] = [];
  newComment: string = '';
  postId!: number;
  userId = 1; // Replace with logged in user

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
    console.log(this.postId)
    this.loadComments();
  }

  loadComments() {
    this.postService.getComments(this.postId).subscribe((data: any[]) => this.comments = data);
  }

  addComment() {
    const dto = { postId: this.postId, userId: this.userId, content: this.newComment };
    this.postService.addComment(dto).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }
}
