import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-recent-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-movies.component.html',
  styleUrl: './recent-movies.component.css'
})
export class RecentMoviesComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error = '';

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getRecentMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des films';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  getImageUrl(posterPath: string): string {
    if (!posterPath) return '';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/movies/detail', id]);
  }
}
