import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { Observable, switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Film, Tv, Users } from 'lucide-angular';
import { SearchInputComponent } from '../../components/search-input/search-input.component';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SearchInputComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultComponent implements OnInit {
  searchResults: any[] = [];
  movies: any[] = [];
  tvShows: any[] = [];
  people: any[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  error: string | null = null;
  Film = Film;
  Tv = Tv;
  Users = Users;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['query'] || '';
        if (this.searchQuery) {
          this.loading = true;
          this.error = null;
          return this.searchService.searchMultimedia(this.searchQuery);
        }
        return [];
      })
    ).subscribe({
      next: (results: any[]) => {
        this.searchResults = results || [];

        // Séparation des résultats par type
        this.movies = this.searchResults.filter(item => item.media_type === 'movie');
        this.tvShows = this.searchResults.filter(item => item.media_type === 'tv');
        this.people = this.searchResults.filter(item => item.media_type === 'person');

        console.log(`Films: ${this.movies.length}, Séries: ${this.tvShows.length}, Personnes: ${this.people.length}`);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la recherche. Veuillez réessayer.';
        this.loading = false;
        console.error('Search error:', err);
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w200${path}`;
  }

  // Méthode pour déterminer si nous avons des résultats
  hasResults(): boolean {
    return this.searchResults && this.searchResults.length > 0;
  }
}
