import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { TvShowService, TvShow } from '../../services/tv-show.service';

@Component({
  selector: 'app-tv-show-popular',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './tv-show-popular.component.html',
  styleUrls: ['./tv-show-popular.component.css']
})
export class TvShowPopularComponent implements OnInit {
  @ViewChild('showsCarousel') showsCarousel!: ElementRef;

  tvShows: TvShow[] = [];
  loading = true;
  error = '';

  // Lucide icons
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  constructor(
    private tvShowService: TvShowService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPopularTvShows();
  }

  loadPopularTvShows(): void {
    this.loading = true;
    this.tvShowService.getPopularTvShows().subscribe({
      next: (data) => {
        this.tvShows = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las series populares';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/tv/detail', id]);
  }

  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster+Available';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  scrollCarousel(direction: 'left' | 'right'): void {
    if (!this.showsCarousel) return;

    const carousel = this.showsCarousel.nativeElement;
    const cardWidth = 260 + 16; // Largeur de carte + gap
    const scrollAmount = cardWidth * 3; // Défiler de 3 cartes à la fois

    if (direction === 'left') {
      carousel.scrollLeft -= scrollAmount;
    } else {
      carousel.scrollLeft += scrollAmount;
    }
  }
}
