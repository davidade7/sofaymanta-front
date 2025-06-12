import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
  searchControl = new FormControl('');
  Search = Search;

  constructor(private router: Router) {}

  search() {
    const query = this.searchControl.value;
    if (query && query.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: query.trim() } });
    }
  }
}
