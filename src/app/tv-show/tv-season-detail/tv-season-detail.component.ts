import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SerieService } from '../../services/serie.service';
import { CommonModule, Location } from '@angular/common';
import {
  LucideAngularModule,
  ArrowLeft,
  Star,
  Calendar,
  Clock,
} from 'lucide-angular';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { TopButtonComponent } from '../../shared/top-button/top-button.component';

@Component({
  selector: 'app-tv-season-detail',
  imports: [
    CommonModule,
    LucideAngularModule,
    BackButtonComponent,
    TopButtonComponent,
  ],
  templateUrl: './tv-season-detail.component.html',
  styleUrls: ['./tv-season-detail.component.css'],
})
export class TvSeasonDetailComponent implements OnInit {
  seasonDetail: any;
  loading = true;
  error: string | null = null;
  showId: string = '';
  seasonNumber: number = 0;

  // Icônes pour le template
  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly Calendar = Calendar;
  readonly Clock = Clock;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: SerieService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.showId = params['showId'];
      this.seasonNumber = parseInt(params['seasonNumber']);

      if (this.showId && this.seasonNumber) {
        this.loadSeasonDetail(this.showId, this.seasonNumber);
      }
    });
  }

  loadSeasonDetail(showId: string, seasonNumber: number): void {
    this.loading = true;
    this.tvShowService.getTvShowSeasonDetail(showId, seasonNumber).subscribe({
      next: (data) => {
        this.seasonDetail = data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.error = 'Error al cargar los detalles de la temporada';
        this.loading = false;
      },
    });
  }

  // Navigation vers les détails d'un épisode
  navigateToEpisode(episodeNumber: number): void {
    // Utiliser la route correcte selon app.routes.ts
    this.router.navigate([
      '/tv',
      this.showId,
      'season',
      this.seasonNumber,
      'episode',
      episodeNumber,
    ]);
  }

  // Navigation vers la série
  navigateToSeries(): void {
    // Utiliser la route correcte selon app.routes.ts
    this.router.navigate(['/serie/detail', this.showId]);
  }

  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster+Available';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getStillImageUrl(path: string | null | undefined): string {
    if (!path) return 'https://placehold.co/500x280?text=No+Image+Available';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  // Formater la date
  formatAirDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Formater la durée
  formatRuntime(minutes: number): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  goBack(): void {
    this.location.back();
  }
}
