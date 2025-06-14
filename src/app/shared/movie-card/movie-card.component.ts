import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Film } from 'lucide-angular';
import { Router } from '@angular/router';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movie: any;
  genres: any[] = [];
  Film = Film;

  constructor(
    private router: Router,
    private genreService: GenreService
  ) {}

  getImageUrl(path: string): string {
    if (!path) return 'https://placehold.co/500x750?text=Imagen+no+disponible&font=open-sans';
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  ngOnInit() {
    this.loadGenres();
  }

  loadGenres() {
    if (this.movie && this.movie.genre_ids) {
      this.genres = this.genreService.getGenresFromIds(this.movie.genre_ids);
    }
  }

  getDisplayGenres() {
    return this.genres.slice(0, 2); // Limite à 2 genres
  }

  truncateOverview(overview: string): string {
    if (!overview) return '';
    return overview.length > 150 ? overview.substring(0, 150) + '...' : overview;
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  navigateToDetails() {
    if (this.movie && this.movie.id) {
      this.router.navigate(['/movie/detail', this.movie.id]);
    }
  }
}
