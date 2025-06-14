import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
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
export class MovieCardComponent implements OnInit {
  @Input() movie: any;
  @ViewChild('moreBadge') moreBadge?: ElementRef;
  @ViewChild('tooltipRef') tooltipRef?: ElementRef;
  genres: { id: number, name: string }[] = [];
  showMoreGenres = false;
  tooltipStyle: any = {};
  Film = Film;

  constructor(
    private router: Router,
    private genreService: GenreService,
    private el: ElementRef
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
    return this.genres.slice(0, 2);
  }

  getAdditionalGenresCount() {
    return Math.max(0, this.genres.length - 2);
  }

  getAdditionalGenres() {
    return this.genres.slice(2);
  }

  truncateOverview(overview: string): string {
    if (!overview) return '';
    return overview.length > 150 ? overview.substring(0, 150) + '...' : overview;
  }

  showTooltip() {
    this.showMoreGenres = true;
  }

  hideTooltip() {
    this.showMoreGenres = false;
  }

  positionTooltip() {
    if (!this.moreBadge || !this.tooltipRef) return;

    const cardRect = this.el.nativeElement.getBoundingClientRect();
    const badgeRect = this.moreBadge.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipRef.nativeElement.getBoundingClientRect();

    // Calcul de la position horizontale
    let left = badgeRect.left - cardRect.left + (badgeRect.width / 2);

    // Vérifier si le tooltip dépasse à gauche
    if (left - (tooltipRect.width / 2) < 0) {
      left = tooltipRect.width / 2;
    }

    // Vérifier si le tooltip dépasse à droite
    if (left + (tooltipRect.width / 2) > cardRect.width) {
      left = cardRect.width - (tooltipRect.width / 2);
    }

    this.tooltipStyle = {
      'left': `${left}px`
    };
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
