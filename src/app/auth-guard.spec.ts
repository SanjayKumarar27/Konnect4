import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth-guard';

// Mock AuthService
class MockAuthService {
  isAuthenticated() {
    return true; // Default to true for testing; change in specific tests
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation when user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);

    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeTrue(); // User is authenticated, so navigation is allowed
  });

  it('should redirect to login when user is not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    spyOn(router, 'navigate'); // Spy on the router's navigate method to check for redirection

    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalse(); // User is not authenticated, so navigation is denied
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Ensure that the guard redirects to login
  });
});
