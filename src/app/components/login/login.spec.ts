import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import FormsModule here
import { of, throwError } from 'rxjs';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create mock services
    authService = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule], // Import both ReactiveFormsModule and FormsModule
      declarations: [Login],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        FormBuilder
      ]
    });

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should call AuthService.login() when the form is valid and login is triggered', () => {
    const mockResponse = {
      user: {
        userId: 1,
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      }
    };
    
    // Setup the mock response for successful login
    authService.login.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.password = 'password123';
    component.onLogin(component.form!);  // Ensure 'component.form!' is properly defined

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(localStorage.getItem('user')).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(['/feed']);
  });
it('should clear error message when form becomes valid', () => {
  // Simulate valid form state
  component.loginForm.controls['email'].setValue('test@example.com');
  component.loginForm.controls['password'].setValue('password123');

  // Create a mock NgForm object for a valid form
  const mockNgForm = jasmine.createSpyObj('NgForm', ['valid']);
  mockNgForm.valid = true;

  // Mock the AuthService login observable to return a successful response
  const mockResponse = {
    user: {
      userId: 1,
      email: 'test@example.com',
      username: 'testuser',
      fullName: 'Test User'
    }
  };
  authService.login.and.returnValue(of(mockResponse)); // Returning a valid observable

  // Call the onLogin method with the mock NgForm
  component.onLogin(mockNgForm);

  // Assert that the errorMessage is cleared
  expect(component.errorMessage).toBe('');
});




  it('should display an error message when login fails', () => {
    const errorResponse = { error: 'Invalid email or password' };

    authService.login.and.returnValue(throwError(() => errorResponse));

    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    component.onLogin(component.form!);

    expect(component.errorMessage).toBe('Invalid email or password');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // it('should navigate to /feed if the user is already authenticated', () => {
  //   authService.isAuthenticated.and.returnValue(true);

  //   component.ngOnInit();

  //   expect(router.navigate).toHaveBeenCalledWith(['/feed']);
  // });

  it('should reset the form fields after successful login', () => {
    const mockResponse = {
      user: {
        userId: 1,
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      }
    };
    
    authService.login.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.password = 'password123';
    component.onLogin(component.form!);

    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.errorMessage).toBe('');
  });
});
