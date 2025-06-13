import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './popular-movies.component.html',
  styleUrls: ['./popular-movies.component.css']
})
export class PopularMoviesComponent implements OnInit {
  @ViewChild('moviesCarousel') moviesCarousel!: ElementRef;

  movies: Movie[] = [];
  loading = true;
  error = '';

  // Lucide icons
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  loadPopularMovies(): void {
    this.loading = true;
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las películas populares';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  navigateToDetail(movieId: number): void {
    this.router.navigate(['/movie/detail', movieId]);
  }

  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster+Available';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  scrollCarousel(direction: 'left' | 'right'): void {
    const carousel = this.moviesCarousel.nativeElement;
    const scrollAmount = carousel.clientWidth * 0.8; // Scroll 80% of visible width

    if (direction === 'left') {
      carousel.scrollLeft -= scrollAmount;
    } else {
      carousel.scrollLeft += scrollAmount;
    }
  }
}
