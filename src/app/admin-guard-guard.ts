// src/app/admin-guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // ✅ Method 1: Use AuthService
    if (this.authService.isAdmin()) {
      console.log('✅ AdminGuard: Access granted - User is Admin');
      return true;
    }

    // ✅ Method 2: Fallback to localStorage check
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'Admin') {
        console.log('✅ AdminGuard: Access granted - User is Admin (localStorage)');
        return true;
      }
    }

    console.log('❌ AdminGuard: Access denied - User is not Admin');
    this.router.navigate(['/home']);
    return false;
  }
}