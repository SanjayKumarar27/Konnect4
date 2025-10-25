import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
  standalone:false
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToUserLogin() {
    this.router.navigate(['/login']);
  }

  goToAdminLogin() {
    console.log('Navigating to Admin Login');
    this.router.navigate(['/admin/login']);
  }
}
