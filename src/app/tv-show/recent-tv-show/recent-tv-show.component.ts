import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { TvShowService, TvShow } from '../../services/tv-show.service';

@Component({
  selector: 'app-recent-tv-show',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recent-tv-show.component.html',
  styleUrl: './recent-tv-show.component.css'
})
export class RecentTvShowComponent implements OnInit {
  tvShows: TvShow[] = [];
  loading = true;
  error = '';
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  @ViewChild('tvShowsCarousel') tvShowsCarousel!: ElementRef;

  constructor(private tvShowService: TvShowService, private router: Router) {}

  ngOnInit() {
    this.loadTvShows();
  }

  loadTvShows() {
    this.tvShowService.getRecentTvShows().subscribe({
      next: (tvShows) => {
        this.tvShows = tvShows;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des séries TV';
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
    this.router.navigate(['/tv/detail', id]);
  }

  scrollCarousel(direction: 'left' | 'right'): void {
    if (!this.tvShowsCarousel) return;

    const carousel = this.tvShowsCarousel.nativeElement;
    const cardWidth = 260 + 16; // Largeur de carte + gap
    const scrollAmount = cardWidth * 3; // Défiler de 3 cartes à la fois

    if (direction === 'left') {
      carousel.scrollLeft -= scrollAmount;
    } else {
      carousel.scrollLeft += scrollAmount;
    }
  }
}
