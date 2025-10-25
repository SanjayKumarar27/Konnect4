import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('adminToken'); // admin token
    if (token) {
      return true;
    }
    this.router.navigate(['/admin/login']);
    return false;
  }
}
