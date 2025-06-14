import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchInputComponent } from '../../shared/search-input/search-input.component';
import { TopButtonComponent } from '../../shared/top-button/top-button.component';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { SerieCardComponent } from '../../shared/serie-card/serie-card.component';
import { PersonCardComponent } from '../../shared/person-card/person-card.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, TopButtonComponent, MovieCardComponent, SerieCardComponent, PersonCardComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  activeFilter: 'all' | 'movies' | 'series' | 'persons' = 'all';

  results = {
    movies: [],
    series: [],
    persons: []
  };

  filteredResults = {
    movies: [],
    series: [],
    persons: []
  };

  totalResults: number = 0;
  loading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  // Pagination (peut ne pas être nécessaire puisque tous les résultats sont renvoyés)
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 20;

  get noResults(): boolean {
    return this.totalResults === 0 && !this.loading;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements de paramètres d'URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      const page = parseInt(params['page']) || 1;
      this.currentPage = page;

      if (this.searchQuery) {
        this.search(this.searchQuery, page);
      }
    });
  }

  search(query: string, page: number = 1): void {
    if (!query.trim()) return;

    this.loading = true;
    this.error = false;

    this.searchService.searchMedia(query, page).subscribe({
      next: (data) => {
        this.results = {
          movies: data.movies || [],
          series: data.series || [],
          persons: data.persons || []
        };

        this.applyFilter();
        this.totalResults = data.total || 0;

        // Si pagination par API nécessaire dans le futur
        this.totalPages = Math.ceil(this.totalResults / this.itemsPerPage);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching media:', err);
        this.error = true;
        this.errorMessage = err.message || 'Error al buscar. Inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  setFilter(filter: 'all' | 'movies' | 'series' | 'persons'): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    switch (this.activeFilter) {
      case 'all':
        this.filteredResults = {
          movies: this.results.movies,
          series: this.results.series,
          persons: this.results.persons
        };
        break;
      case 'movies':
        this.filteredResults = {
          movies: this.results.movies,
          series: [],
          persons: []
        };
        break;
      case 'series':
        this.filteredResults = {
          movies: [],
          series: this.results.series,
          persons: []
        };
        break;
      case 'persons':
        this.filteredResults = {
          movies: [],
          series: [],
          persons: this.results.persons
        };
        break;
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query: this.searchQuery, page: page },
      queryParamsHandling: 'merge'
    });
  }

  getTotalResults(): number {
    return (this.results.movies?.length || 0) +
          (this.results.series?.length || 0) +
          (this.results.persons?.length || 0);
  }
}
