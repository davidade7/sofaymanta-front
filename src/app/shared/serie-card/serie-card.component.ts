import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Tv } from 'lucide-angular';
import { Router } from '@angular/router';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-serie-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './serie-card.component.html',
  styleUrl: './serie-card.component.css'
})
export class SerieCardComponent implements OnInit {
  @Input() serie: any;
  @Output() cardClick = new EventEmitter<number>();
  @ViewChild('moreBadge') moreBadge?: ElementRef;
  @ViewChild('tooltipRef') tooltipRef?: ElementRef;

  genres: { id: number, name: string }[] = [];
  showMoreGenres = false;
  tooltipStyle: any = {};
  Tv = Tv;

  constructor(
    private router: Router,
    private genreService: GenreService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.loadGenres();
  }

  loadGenres() {
    if (this.serie && this.serie.genre_ids) {
      this.genres = this.genreService.getGenresFromIds(this.serie.genre_ids);
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

  showTooltip() {
    this.showMoreGenres = true;
  }

  hideTooltip() {
    this.showMoreGenres = false;
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://placehold.co/500x750?text=Imagen+no+disponible&font=open-sans';
    return `https://image.tmdb.org/t/p/w300${path}`;
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
    if (this.serie && this.serie.id) {
      this.router.navigate(['/serie/detail', this.serie.id]);
    }
  }
}
