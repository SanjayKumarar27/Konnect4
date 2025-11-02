import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
    service = TestBed.inject(UserService);

    // Mock localStorage methods
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set user to localStorage', () => {
    const user = { email: 'test@example.com', username: 'testuser' };
    service.setUser(user);

    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
  });

  it('should get user from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ email: 'test@example.com', username: 'testuser' }));
    
    const user = service.getUser();

    expect(user).toEqual({ email: 'test@example.com', username: 'testuser' });
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });

  it('should return default user when no user is stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Simulate no user in localStorage

    const user = service.getUser();

    expect(user).toEqual({ email: '', username: '' });
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });

  it('should return default user when localStorage data is corrupted', () => {
    spyOn(localStorage, 'getItem').and.returnValue('{invalid JSON}'); // Simulate corrupted data

    // Spy on console.error to capture the error logging
    const consoleErrorSpy = spyOn(console, 'error');

    const user = service.getUser();

    expect(user).toEqual({ email: '', username: '' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing user data from localStorage:', jasmine.any(Error));
  });

  it('should clear user from localStorage', () => {
    service.clearUser();

    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
});
