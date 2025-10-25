import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
  standalone: false,
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    const credentials = { email: this.email, password: this.password };

    this.adminAuth.login(credentials).subscribe({
      next: (res: any) => {
        // Save JWT token
        this.adminAuth.saveToken(res.token);

        // Optional: Save admin details for display in dashboard
        localStorage.setItem('adminEmail', res.admin.email);
        localStorage.setItem('adminUsername', res.admin.username);

        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err?.error || 'Invalid email or password';
        this.isLoading = false;
      },
    });
  }
}
