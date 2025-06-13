import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ChevronLeft, ChevronRight } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-recent-movies',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recent-movies.component.html',
  styleUrls: ['./recent-movies.component.css']
})
export class RecentMoviesComponent implements OnInit {
  // Icons for carousel navigation
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  movies: any[] = [];
  loading = true;
  error: string | null = null;

  @ViewChild('moviesCarousel') moviesCarousel!: ElementRef;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentMovies();
  }

  // Load recent movies from API
  loadRecentMovies(): void {
    this.loading = true;
    this.error = null;

    this.movieService.getRecentMovies().subscribe({
      next: (response) => {
        this.movies = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las películas recientes. Por favor intente nuevamente.';
        this.loading = false;
        console.error('Error cargando películas recientes:', err);
      }
    });
  }

  // Get image URL for movie poster
  getImageUrl(posterPath: string): string {
    if (!posterPath) {
      return 'assets/images/no-poster.jpg';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  // Handle carousel scrolling
  scrollCarousel(direction: 'left' | 'right'): void {
    const carousel = this.moviesCarousel.nativeElement;
    const scrollAmount = carousel.clientWidth * 0.8; // Scroll 80% of visible width

    if (direction === 'left') {
      carousel.scrollLeft -= scrollAmount;
    } else {
      carousel.scrollLeft += scrollAmount;
    }
  }

  // Navigate to movie detail page
  navigateToDetail(movieId: number): void {
    this.router.navigate(['/movie/detail', movieId]);
  }
}
