//Login.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class Login implements OnInit {
 loginForm: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPopup: boolean = false;

  @ViewChild('loginForm') form: NgForm | undefined;

  get emailControl() { return this.loginForm.get('email')!; }
  get passwordControl() { return this.loginForm.get('password')!; }

  constructor(private router: Router, private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {
    // Redirect to home if already logged in
    console.log('Login ngOnInit: isAuthenticated =', this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/feed']);
    }
  }

  onLogin(form:NgForm) {
    if(!form.valid){
      this.errorMessage="Form Is Not Valid"
      return;
    }
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