import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Konnect4');
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // ✅ Add all routes where you don't want sidebar/topbar
        const noLayoutRoutes = ['/login', '/register','/', '/admin/login','/admin/dashboard'];
        this.showLayout = !noLayoutRoutes.includes(event.urlAfterRedirects);
      });
  }
}
