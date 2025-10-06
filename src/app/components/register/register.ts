import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
; // Adjust path as needed

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class Register implements OnInit {
  fullName:string='';
  username: string = '';
  email: string = '';
  password: string = '';
  showPopup:boolean=false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Redirect to home if already logged in
    console.log('Register ngOnInit: isAuthenticated =', this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      console.log('Already authenticated, redirecting to /home');
      this.router.navigate(['/home']);
    }
  }

  onRegister() {
    // Simulate registration and store user data (replace with real API call)
    this.authService.register({ username: this.username,fullName: this.fullName, email: this.email, password: this.password }).subscribe({
      next: (response) => {
           console.log('Login successful:', response);
            this.showPopup = true;
        // Removed localStorage.setItem('user', ...) to prevent auto-login after registration
        console.log('Register:', { username: this.username,fullName: this.fullName, email: this.email, password: this.password });
        console.log('Registration successful, navigating to /login');
        this.resetForm(); // Clear form fields
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        // Optionally show error in template
      }
    });
  }

  resetForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    console.log('Register form reset');
  }
}