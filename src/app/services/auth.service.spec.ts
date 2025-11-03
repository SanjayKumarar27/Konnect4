import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const apiUrl = 'https://localhost:7214/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests are left
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is authenticated (user exists in localStorage)', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test' }));
    localStorage.setItem('auth_token', JSON.stringify({ token: 'fake-token' }));
    // Manually trigger token loading after setting it in localStorage for the test
    (service as any).loadToken();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if user is not authenticated (user does not exist in localStorage)', () => {
    localStorage.removeItem('user');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should call login() and set user in localStorage on success', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    const mockResponse = {
      user: { userId: 1, email: 'test@example.com', username: 'testuser', fullName: 'Test User', role: 'User' },
      token: 'fake-jwt-token'
    };

    spyOn(service['loggedIn'], 'next'); // Spy on BehaviorSubject to check its state change

    service.login(loginData).subscribe((response) => {
      const expectedUser = { userId: 1, email: 'test@example.com', username: 'testuser', fullName: 'Test User', role: 'User' };
      expect(response.user).toEqual(expectedUser);
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(expectedUser));
      expect(service['loggedIn'].next).toHaveBeenCalledWith(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Simulate backend response
  });

  it('should call register() and log the registration success message', () => {
    const registerData = { username: 'newuser', email: 'newuser@example.com', password: 'password123' };
    const mockResponse = { message: 'Registration successful' };

    spyOn(console, 'log'); // Spy on console.log to verify the success message

    service.register(registerData).subscribe((response) => {
      expect(response.message).toBe('Registration successful');
      expect(console.log).toHaveBeenCalledWith('AuthService: Registration successful', mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Simulate backend response
  });

  it('should call logout() and remove user from localStorage', () => {
  // Mock logged-in user in localStorage
  localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));
  localStorage.setItem('auth_token', JSON.stringify({ token: 'fake-token' }));

  // Spy on BehaviorSubject to track the change in login state
  const loggedInSpy = spyOn(service['loggedIn'], 'next').and.callThrough();

  // Spy on console.log to verify logout message
  spyOn(console, 'log'); 

  // Call logout
  service.logout();

  // Assert that the user was removed from localStorage
  expect(localStorage.getItem('user')).toBeNull();
  expect(localStorage.getItem('auth_token')).toBeNull();

  // Assert that loggedIn.next was called with false to indicate logout
  expect(loggedInSpy).toHaveBeenCalledWith(false);

  // Assert that the logout message was logged
  expect(console.log).toHaveBeenCalledWith('🚪 Logged out - Token cleared');
});


  it('should return current logged-in user using getCurrentUser()', () => {
    const mockUser = { userId: 1, username: 'testuser', email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const currentUser = service.getCurrentUser();

    expect(currentUser).toEqual(mockUser);
  });

  it('should return null if no user is found in localStorage when calling getCurrentUser()', () => {
    localStorage.removeItem('user');

    const currentUser = service.getCurrentUser();

    expect(currentUser).toBeNull();
  });
});
