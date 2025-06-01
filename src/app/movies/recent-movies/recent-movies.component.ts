import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-recent-movies',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recent-movies.component.html',
  styleUrl: './recent-movies.component.css'
})
export class RecentMoviesComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error = '';
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  @ViewChild('moviesCarousel') moviesCarousel!: ElementRef;

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

  scrollCarousel(direction: 'left' | 'right'): void {
    if (!this.moviesCarousel) return;

    const carousel = this.moviesCarousel.nativeElement;
    const cardWidth = 260 + 16; // Largeur de carte + gap
    const scrollAmount = cardWidth * 3; // Défiler de 3 cartes à la fois

    if (direction === 'left') {
      carousel.scrollLeft -= scrollAmount;
    } else {
      carousel.scrollLeft += scrollAmount;
    }
  }
}
