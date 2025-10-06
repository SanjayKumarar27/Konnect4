import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-post-update',
  templateUrl: './post-update.html',
  styleUrls: ['./post-update.css'],
  standalone: false
})
export class PostUpdate implements OnInit {
  @Input() postId!: number; // passed from parent
  @Input() username: string = ''; // display username
  userId!: number; // logged-in user

  content: string = '';
  imageUrl: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  remainingChars = 1000;

  avatarUrl: string = '';

  constructor(private postService: PostService, private router: Router) {}

ngOnInit() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    this.userId = user.userId;
  }

  this.avatarUrl = `https://ui-avatars.com/api/?name=${this.username}&background=0A66C2&color=fff`;

}


  onContentChange() {
    this.remainingChars = 1000 - (this.content?.length || 0);
  }

  onImageUrlChange() {
    if (this.imageUrl) {
      this.previewUrl = this.imageUrl;
    } else if (!this.selectedFile) {
      this.previewUrl = null;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files && event.target.files[0];
    if (!file) return;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);

    this.imageUrl = '';
  }

  clearImage() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.imageUrl = '';
  }

  canUpdate() {
    return (this.content || '').trim().length > 0 && this.postId && this.userId;
  }

  onUpdate() {
    if (!this.canUpdate()) {
      alert('Cannot update post. Missing information.');
      return;
    }

    const dto: any = {
      content: this.content.trim(),
      imageUrl: this.imageUrl || this.previewUrl || null
    };

    this.postService.updatePost(this.postId, dto, this.userId).subscribe({
      next: (res) => {
        alert('Post updated successfully!');
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update post.');
      }
    });
  }

  cancelUpdate() {
    this.router.navigate(['/feed']);
  }
}
