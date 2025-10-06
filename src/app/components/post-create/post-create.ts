import { Component } from '@angular/core';
import { PostService } from '../../services/post-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.css'],
  standalone:false
})
export class PostCreateComponent {
  content: string = '';
  imageUrl: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  remainingChars = 1000;
  userId = 1; // replace with actual logged-in user id
  avatarUrl = `https://ui-avatars.com/api/?name=User&background=0A66C2&color=fff`;

  constructor(private postService: PostService, private router: Router) {}

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

    // Clear imageUrl input when a file is chosen
    this.imageUrl = '';
  }

  clearImage() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.imageUrl = '';
  }

  canPost() {
    const hasText = (this.content || '').trim().length > 0;
    return hasText;
  }

  onSubmit() {
    if (!this.canPost()) return;

    // If you want to support file upload you'd need a backend endpoint that accepts multipart/form-data.
    // For now we prefer using imageUrl if provided; if file selected, try to send base64 in the DTO (only if backend supports it).
    const dto: any = {
      userId: this.userId,
      content: this.content.trim(),
      imageUrl: this.imageUrl || this.previewUrl || null
    };

    this.postService.createPost(dto).subscribe({
      next: (res) => {
        // reset form then navigate to feed or refresh
        this.content = '';
        this.imageUrl = '';
        this.previewUrl = null;
        this.selectedFile = null;
        this.onContentChange();
        // Option A: navigate to feed
        this.router.navigate(['/feed']);
        // Option B: or emit an event to parent to refresh feed if you have an event mechanism
      },
      error: (err) => {
        console.error('Create post failed', err);
        alert('Failed to create post. Try again.');
      }
    });
  }
}
