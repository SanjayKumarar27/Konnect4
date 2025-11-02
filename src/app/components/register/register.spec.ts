// src/app/components/register/register.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Register } from './register';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    register: jasmine.createSpy('register'),
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Register],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // TEST 1: Form validation - invalid when empty
  it('should invalidate form when fields are empty', () => {
    expect(component.registerForm.valid).toBeFalse();

    const fullName = component.fullName;
    const username = component.username;
    const email = component.email;
    const password = component.password;
    const confirmPassword = component.confirmPassword;

    expect(fullName?.errors?.['required']).toBeTruthy();
    expect(username?.errors?.['required']).toBeTruthy();
    expect(email?.errors?.['required']).toBeTruthy();
    expect(password?.errors?.['required']).toBeTruthy();
    expect(confirmPassword?.errors?.['required']).toBeTruthy();
  });

  // TEST 2: Form validation - username pattern & minLength
  it('should invalidate username with invalid pattern or short length', () => {
    const username = component.username;

    username?.setValue('ab'); // too short
    expect(username?.errors?.['minlength']).toBeTruthy();

    username?.setValue('ab!'); // invalid char
    expect(username?.errors?.['pattern']).toBeTruthy();

    username?.setValue('valid_user'); // valid
    expect(username?.valid).toBeTrue();
  });

  // TEST 3: Password mismatch validator - real-time
  it('should show password mismatch error when passwords do not match', fakeAsync(() => {
    component.password?.setValue('password123');
    component.confirmPassword?.setValue('different');
    tick(); // trigger change detection

    expect(component.confirmPassword?.errors?.['passwordMismatch']).toBeTruthy();
    expect(component.registerForm.errors?.['passwordMismatch']).toBeTruthy();

    component.confirmPassword?.setValue('password123');
    tick();

    expect(component.confirmPassword?.errors?.['passwordMismatch']).toBeFalsy();
    expect(component.registerForm.errors).toBeNull();
  }));

  // TEST 4: Successful registration - shows popup and redirects
  it('should register successfully, show popup, and redirect to login', fakeAsync(() => {
    // Mock successful response
    authService.register.and.returnValue(of({}));

    // Fill valid form
    component.registerForm.patchValue({
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'secret123',
      confirmPassword: 'secret123'
    });

    const navigateSpy = spyOn(router, 'navigate');

    component.onRegister();
    tick(1500); // wait for setTimeout

    expect(authService.register).toHaveBeenCalledWith({
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'secret123'
    });
    expect(component.showPopup).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));

  // TEST 5: Failed registration - shows error message
  it('should show error message on registration failure', fakeAsync(() => {
    const errorResponse = { error: { message: 'Email already exists' } };
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.patchValue({
      fullName: 'Jane',
      username: 'jane',
      email: 'jane@example.com',
      password: 'pass123',
      confirmPassword: 'pass123'
    });

    component.onRegister();
    tick();

    expect(component.errorMessage).toBe('Email already exists');
    expect(component.showPopup).toBeFalse();
  }));

  // BONUS: Redirect if already authenticated
  it('should redirect to home if user is already authenticated on init', () => {
    authService.isAuthenticated.and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});