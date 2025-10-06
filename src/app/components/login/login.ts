//Login.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPopup:boolean=false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Redirect to home if already logged in
    console.log('Login ngOnInit: isAuthenticated =', this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/feed']);
    }
  }

  onLogin() {
    // Clear previous error
    this.errorMessage = '';
    // Call AuthService login
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
       // Store the user data including userId in localStorage
      const user = response.user; // user returned from API
      localStorage.setItem('user', JSON.stringify({
        userId: user.userId,       // <- store userId
        email: user.email,
        username: user.username,
        fullName: user.fullName
      }));

      console.log('Login successful:', user);
      
      this.resetForm(); // Clear form fields
      this.router.navigate(['/feed']);
    },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
        console.error('Login failed:', err);
      }
    });
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    console.log('Login form reset');
  }
}