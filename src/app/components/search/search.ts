import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SearchService } from '../../services/search';
import { UserList } from '../../models/user';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent {
  query: string = '';
  suggestions: UserList[] = [];
  isFocused: boolean = false;  // Track focus state

  constructor(private searchService: SearchService, private router: Router) {}

  onInput() {
    this.searchService.getSuggestions(this.query).subscribe(list => {
      this.suggestions = list;
    });
  }

  selectSuggestion(user: UserList) {
    this.router.navigate(['/profile', user.userId]);
    this.query = '';
    this.suggestions = [];
    this.isFocused = false; // hide suggestions after selection
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    // Add a small timeout to allow clicking suggestions before hiding
    setTimeout(() => {
      this.isFocused = false;
    }, 150);
  }
}
