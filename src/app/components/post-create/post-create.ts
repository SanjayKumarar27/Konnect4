import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post-service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.css'],
  standalone: false
})
export class PostCreateComponent implements OnInit {
  content: string = '';
  imageUrl: string = '';
  category='';
  imagePreview: string | null = null;   // ADD THIS
isSubmitting = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  remainingChars = 1000;
  userId!: number; // Will be loaded from localStorage  
   private emojiSub!: Subscription;
  emojiInput$ = new BehaviorSubject<string>('');
  avatarUrl = `https://ui-avatars.com/api/?name=User&background=0A66C2&color=fff`;
  

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.loadUserId();
     this.emojiSub = this.emojiInput$.subscribe((emoji) => {
      if (emoji) this.content += emoji;
    });
  }
    ngOnDestroy(): void {
    this.emojiSub?.unsubscribe();
  }
  

  loadUserId() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.userId;
      console.log('Logged-in userId:', this.userId);
    } else {
      console.error('No user found in localStorage. Redirecting to login.');
      // Optional: redirect to login page
      // this.router.navigate(['/login']);
    }
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
    if (!this.canPost() || !this.userId) return;

    const dto: any = {
      userId: this.userId,
      content: this.content.trim(),
      imageUrl: this.imageUrl || this.previewUrl || null,
      category: this.category
    };

    this.postService.createPost(dto).subscribe({
      next: (res) => {
        // Reset form
        this.content = '';
        this.imageUrl = '';
        this.previewUrl = null;
        this.selectedFile = null;
        this.onContentChange();

        // Navigate to feed
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        console.error('Create post failed', err);
        alert('Failed to create post. Try again.');
      }
    });
  }
}
