import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  Star,
  MessageSquare,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-angular';
import { SerieService } from '../../services/serie.service';
import {
  UserMediaInteractionsService,
  UserMediaInteraction,
} from '../../services/userMediaInteractions.service';
import { AuthService } from '../../services/auth.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { TopButtonComponent } from '../../shared/top-button/top-button.component';
import { RatingComponent } from '../../shared/rating/rating.component';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { PersonCardVariantComponent } from '../../shared/person-card-variant/person-card-variant.component';

@Component({
  selector: 'app-tv-episode-detail',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BackButtonComponent,
    TopButtonComponent,
    RatingComponent,
    CarouselComponent,
    PersonCardVariantComponent,
  ],
  templateUrl: './tv-episode-detail.component.html',
  styleUrls: ['./tv-episode-detail.component.css'],
})
export class TvEpisodeDetailComponent implements OnInit {
  // Icônes disponibles pour le template
  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly MessageSquare = MessageSquare;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly Clock = Clock;

  episode: any = null;
  episodeCredits: any = null;
  tvShowId: string = '';
  seasonNumber: number = 0;
  episodeNumber: number = 0;
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  userInteraction: UserMediaInteraction | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serieService: SerieService,
    private userMediaInteractionsService: UserMediaInteractionsService,
    private authService: AuthService,
    private location: Location
  ) {}

  get seriesId(): number {
    return parseInt(this.tvShowId);
  }

  async ngOnInit(): Promise<void> {
    // Charger l'utilisateur actuel
    await this.loadCurrentUser();

    // Charger l'épisode
    this.route.paramMap.subscribe((params) => {
      this.tvShowId = params.get('showId') || '';
      this.seasonNumber = Number(params.get('seasonNumber')) || 0;
      this.episodeNumber = Number(params.get('episodeNumber')) || 0;

      if (this.tvShowId && this.seasonNumber && this.episodeNumber) {
        this.loadEpisode();
      }
    });
  }

  async loadCurrentUser() {
    try {
      const { data, error } = await this.authService.getUser();
      if (!error && data.user) {
        this.currentUser = data.user;
      }
    } catch (error) {
      console.log('Usuario no autenticado o error al cargar el usuario', error);
    }
  }

  loadEpisode(): void {
    this.loading = true;

    // Charger les détails de l'épisode
    this.serieService
      .getTvShowEpisodeDetail(
        this.tvShowId,
        this.seasonNumber,
        this.episodeNumber
      )
      .subscribe({
        next: (data) => {
          this.episode = data;
          console.log('Episode details:', this.episode);

          // Charger les crédits de l'épisode
          this.loadEpisodeCredits();

          // Charger l'interaction utilisateur
          if (this.currentUser && this.seriesId) {
            this.loadUserInteraction();
          }
        },
        error: (err) => {
          console.error('Error loading episode details', err);
          this.error = 'Error al cargar los detalles del episodio';
          this.loading = false;
        },
      });
  }

  loadEpisodeCredits(): void {
    this.serieService
      .getTvShowEpisodesCredits(
        this.tvShowId,
        this.seasonNumber,
        this.episodeNumber
      )
      .subscribe({
        next: (credits) => {
          this.episodeCredits = credits;
          console.log('Episode credits:', this.episodeCredits);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading episode credits', err);
          this.loading = false;
        },
      });
  }

  loadUserInteraction() {
    if (
      !this.currentUser ||
      !this.seriesId ||
      !this.seasonNumber ||
      !this.episodeNumber
    ) {
      return;
    }

    this.userMediaInteractionsService
      .getUserMediaInteraction(
        this.currentUser.id,
        this.seriesId,
        'tv',
        this.seasonNumber,
        this.episodeNumber
      )
      .subscribe({
        next: (interaction) => {
          this.userInteraction = interaction;
        },
        error: (error) => {
          this.userInteraction = null;
        },
      });
  }

  // Propriétés calculées pour les carrousels
  get cast() {
    return this.episodeCredits?.cast || [];
  }

  get guestStars() {
    return this.episodeCredits?.guest_stars || [];
  }

  get crewMembers() {
    return this.episodeCredits?.crew || [];
  }

  // Méthodes pour adapter les données pour PersonCard
  adaptPersonForCard(person: any, type: 'cast' | 'guest_stars' | 'crew') {
    return {
      ...person,
      role:
        type === 'cast' || type === 'guest_stars'
          ? person.character
          : person.job,
      known_for_department:
        person.known_for_department ||
        (type === 'cast' || type === 'guest_stars'
          ? 'Acting'
          : person.department),
    };
  }

  // TrackBy function pour optimiser le rendu
  trackByPersonId(index: number, person: any): number {
    return person.id;
  }

  goBack(): void {
    this.location.back();
  }

  // Navigation
  navigateToSeries() {
    this.router.navigate(['/serie/detail', this.tvShowId]);
  }

  navigateToSeason() {
    this.router.navigate(['/tv', this.tvShowId, 'season', this.seasonNumber]);
  }

  // Méthodes utilitaires
  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'https://placehold.co/500x280?text=No+Image+Available';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  formatAirDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
