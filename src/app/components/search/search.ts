// search.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserList } from '../../models/user';
import { SearchService } from '../../services/search';


@Component({
  selector: 'app-search',
  standalone:false,
  templateUrl: './search.html'
})
export class SearchComponent {
  query: string = '';
  suggestions: UserList[] = [];

  constructor(private searchService: SearchService, private router: Router) {}

  onSearch() {
    this.searchService.getSuggestions(this.query).subscribe(users => {
      this.suggestions = users;
    });
  }

  
  goToProfile(userId: number) {
  if (!userId) {
    console.error('Invalid userId:', userId);
    
    return; // Prevent navigation
  }
  this.router.navigate(['/profile', userId]);
   this.query = ''; // clear input
    this.suggestions = []; // hide dropdown
}
}
