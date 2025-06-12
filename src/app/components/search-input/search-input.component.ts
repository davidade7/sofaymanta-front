import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent implements OnInit {
  searchControl = new FormControl('');
  Search = Search;

  constructor(private router: Router) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value && value.length > 2) {
        this.search();
      }
    });
  }

  search() {
    const query = this.searchControl.value;
    if (query && query.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: query.trim() } });
    }
  }
}
