import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  open = true;

  constructor(private router: Router) {}

  toggle = () => { this.open = !this.open; }

  goHome = () => { this.router.navigate(['/home']); }
  goCreatePost = () => { this.router.navigate(['/create-post']); }
  goSearch = () => { this.router.navigate(['/home']); }
  goExplore=() => { this.router.navigate(['/Explore']), { replaceUrl: true }; };
  logout = () => { 
    localStorage.clear();
    this.router.navigate(['/login']); }
}
