// src/app/app.ts
import { Component, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Konnect4');
  showLayout = true;
  userRole: string = 'User'; // ✅ NEW: Track user role

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const noLayoutRoutes = ['/login', '/register'];
        this.showLayout = !noLayoutRoutes.includes(event.urlAfterRedirects);
      });
  }

  ngOnInit() {
    this.loadUserRole();
  }

  // ✅ NEW: Load user role from localStorage
  loadUserRole() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole = user.role || 'User';
    }
  }

  // ✅ NEW: Check if user is admin
  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }
}