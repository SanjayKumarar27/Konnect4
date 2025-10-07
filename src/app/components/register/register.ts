import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
; // Adjust path as needed

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class Register implements OnInit {
  registerForm: FormGroup;
  fullName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPopup: boolean = false;

  @ViewChild('registerForm') form: NgForm | undefined;

  get fullNameControl() { return this.registerForm.get('fullName')!; }
  get usernameControl() { return this.registerForm.get('username')!; }
  get emailControl() { return this.registerForm.get('email')!; }
  get passwordControl() { return this.registerForm.get('password')!; }

  constructor(private router: Router, private authService: AuthService) {
    this.registerForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
  ngOnInit() {
    // Redirect to home if already logged in
    console.log('Register ngOnInit: isAuthenticated =', this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      console.log('Already authenticated, redirecting to /home');
      this.router.navigate(['/home']);
    }
  }

    onRegister(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Please fix the errors in the form';
      return;
    }

    this.errorMessage = '';
    this.authService.register({ username: this.username, fullName: this.fullName, email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.showPopup = true;
        console.log('Register:', { username: this.username, fullName: this.fullName, email: this.email, password: this.password });
        console.log('Registration successful, navigating to /login');
        this.resetForm();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed, please try again';
        console.error('Registration failed:', err);
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