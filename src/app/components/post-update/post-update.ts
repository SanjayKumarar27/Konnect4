import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-post-update',
  templateUrl: './post-update.html',
  styleUrls: ['./post-update.css'],
  standalone:false
})
export class PostUpdate implements OnInit {
  content: string = '';
  imageUrl: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  remainingChars = 1000;

  userId!: number;
  postId!: number;
  avatarUrl = `https://ui-avatars.com/api/?name=User&background=0A66C2&color=fff`;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute   // ✅ injected properly
  ) {}

  ngOnInit() {
    this.loadUserId();

    // ✅ Get postId from URL
    const id = this.route.snapshot.paramMap.get('postId');
    if (id) {
      this.postId = Number(id);
    }
  }

  loadUserId() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userId = JSON.parse(storedUser).userId;
    }
  }


  onContentChange() {
    this.remainingChars = 1000 - (this.content?.length || 0);
  }

  onImageUrlChange() {
    this.previewUrl = this.imageUrl || null;
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

    this.imageUrl = ''; // clear URL input when file is chosen
  }

  clearImage() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.imageUrl = '';
  }

  canUpdate() {
    return (this.content || '').trim().length > 0;
  }

  onSubmit() {
    if (!this.canUpdate() || !this.userId || !this.postId) return;

    const dto: any = {
      content: this.content.trim(),
      imageUrl: this.imageUrl || this.previewUrl || null
    };

    this.postService.updatePost(this.postId, dto, this.userId).subscribe({
      next: () => {
        // alert('Post updated!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Update post failed', err);
        alert('Failed to update post. Try again.');
      }
    });
  }
}
