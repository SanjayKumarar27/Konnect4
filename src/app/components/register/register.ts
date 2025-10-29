import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class Register implements OnInit {
  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { 
    validators: passwordMatchValidator as ValidatorFn,
    updateOn: 'change'  // ← TRIGGER VALIDATION ON EVERY KEYSTROKE
  });

  errorMessage = '';
  showPopup = false;

  get fullName() { return this.registerForm.get('fullName'); }
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onRegister() {
  if (this.registerForm.invalid) {
    this.markAllTouched();
    return;
  }

  this.errorMessage = '';

  // ← FIXED: Use ?? '' to ensure string
  const fullName = this.registerForm.get('fullName')?.value ?? '';
  const username = this.registerForm.get('username')?.value ?? '';
  const email = this.registerForm.get('email')?.value ?? '';
  const password = this.registerForm.get('password')?.value ?? '';

  this.authService.register({ username, fullName, email, password }).subscribe({
    next: () => {
      this.showPopup = true;
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Registration failed.';
    }
  });
}

  markAllTouched() {
    Object.values(this.registerForm.controls).forEach(control => control.markAsTouched());
  }
}

// ————————————————————
// PASSWORD MATCH VALIDATOR (REAL-TIME)
// ————————————————————
const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  const form = control as FormGroup;
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  // Only validate if both fields are filled
  if (password && confirmPassword && password !== confirmPassword) {
    form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Clear error if match
    const errors = form.get('confirmPassword')?.errors;
    if (errors && errors['passwordMismatch']) {
      delete errors['passwordMismatch'];
      form.get('confirmPassword')?.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }
};