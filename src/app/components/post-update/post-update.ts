import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post-service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-update',
  templateUrl: './post-update.html',
  styleUrls: ['./post-update.css'],
  standalone:false
})
export class PostUpdate implements OnInit {
  content: string = '';
  imageUrl: string = '';
   category='';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  remainingChars = 1000;
  private emojiSub!: Subscription;
   emojiInput$ = new BehaviorSubject<string>('');

  userId!: number;
  postId!: number;
  avatarUrl: string = '';

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
      this.userId = JSON.parse(storedUser).userId;
      const user = JSON.parse(storedUser);
      if (user.profileImageUrl) {
        this.avatarUrl = user.profileImageUrl;
      } else if (user.fullName) {
        this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName.substring(0, 2))}&background=0D8ABC&color=fff`;
      } else {
        this.avatarUrl = `https://ui-avatars.com/api/?name=NA&background=0D8ABC&color=fff`;
      }
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
