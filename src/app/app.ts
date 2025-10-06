 import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone:false,
  styleUrls: ['./app.css']   // ✅ fixed (plural, array)
})
export class App {
  protected readonly title = signal('Konnect4');
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const noLayoutRoutes = ['/login', '/register'];
        this.showLayout = !noLayoutRoutes.includes(event.urlAfterRedirects);
      });
  }
}