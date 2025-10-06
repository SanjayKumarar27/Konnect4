import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  setUser(user: { email: string; username: string }) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): { email: string; username: string } {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : { email: '', username: '' };
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return { email: '', username: '' };
    }
  }

  clearUser() {
    localStorage.removeItem('user');
  }
}