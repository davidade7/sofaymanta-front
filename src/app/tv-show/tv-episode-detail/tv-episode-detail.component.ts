import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Star, MessageSquare, Trash2, Calendar, Clock, Play } from 'lucide-angular';
import { SerieService } from '../../services/serie.service';
import { UserMediaInteractionsService, UserMediaInteraction } from '../../services/userMediaInteractions.service';
import { AuthService } from '../../services/auth.service';
import { RatingModalComponent } from '../../shared/rating-modal/rating-modal.component';
import { DeleteConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { PersonCardComponent } from '../../shared/person-card/person-card.component';

@Component({
  selector: 'app-tv-episode-detail',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RatingModalComponent,
    DeleteConfirmationModalComponent,
    CarouselComponent,
    PersonCardComponent
  ],
  templateUrl: './tv-episode-detail.component.html',
  styleUrls: ['./tv-episode-detail.component.css']
})
export class TvEpisodeDetailComponent implements OnInit {
  // Icônes disponibles pour le template
  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly MessageSquare = MessageSquare;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Play = Play;

  episode: any = null;
  tvShowId: string = '';
  seasonNumber: number = 0;
  episodeNumber: number = 0;
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  userInteraction: UserMediaInteraction | null = null;
  showRatingModal = false;
  showDeleteModal = false;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serieService: SerieService,
    private userMediaInteractionsService: UserMediaInteractionsService,
    private authService: AuthService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    // Load the current user
    await this.loadCurrentUser();

    // Load the episode - utiliser les bons noms de paramètres
    this.route.paramMap.subscribe(params => {
      this.tvShowId = params.get('showId') || '';  // 'showId' selon les routes
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
    this.serieService.getTvShowEpisodeDetail(this.tvShowId, this.seasonNumber, this.episodeNumber).subscribe({
      next: (data) => {
        this.episode = data;
        this.loading = false;

        // Load user interaction if the user is authenticated
        if (this.currentUser) {
          this.loadUserInteraction();
        }
      },
      error: (err) => {
        console.error('Error loading episode details', err);
        this.error = 'Error al cargar los detalles del episodio';
        this.loading = false;
      }
    });
  }

  // Propriétés calculées pour les carrousels
  get guestStars() {
    return this.episode?.guest_stars || [];
  }

  get crewMembers() {
    return this.episode?.crew || [];
  }

  // Méthodes pour adapter les données pour PersonCard
  adaptPersonForCard(person: any, type: 'guest_stars' | 'crew') {
    return {
      ...person,
      // Pour les guest stars, on utilise 'character', pour le crew, on utilise 'job'
      role: type === 'guest_stars' ? person.character : person.job,
      // Marquer si c'est un guest star
      isGuestStar: type === 'guest_stars',
      // S'assurer que known_for_department existe
      known_for_department: person.known_for_department ||
        (type === 'guest_stars' ? 'Acting' : person.department)
    };
  }

  // TrackBy function pour optimiser le rendu
  trackByPersonId(index: number, person: any): number {
    return person.id;
  }

  loadUserInteraction() {
    if (!this.currentUser || !this.episode) return;

    this.userMediaInteractionsService.getUserMediaInteraction(
      this.currentUser.id,
      this.episode.id,
      'tv'
    ).subscribe({
      next: (interaction) => {
        this.userInteraction = interaction;
      },
      error: (error) => {
        this.userInteraction = null;
      }
    });
  }

  openRatingModal() {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para evaluar este episodio');
      return;
    }
    this.showRatingModal = true;
  }

  closeRatingModal() {
    this.showRatingModal = false;
  }

  onInteractionSaved(interaction: UserMediaInteraction) {
    this.userInteraction = interaction;
    this.showRatingModal = false;
  }

  // Méthodes pour la suppression
  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDeleteInteraction() {
    if (!this.userInteraction || !this.currentUser) return;

    this.isDeleting = true;

    this.userMediaInteractionsService.deleteInteraction(
      this.userInteraction.id,
      this.currentUser.id
    ).subscribe({
      next: (response) => {
        this.userInteraction = null;
        this.isDeleting = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Error deleting interaction:', error);
        alert('Error al eliminar la evaluación. Intenta de nuevo.');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  // Navigation vers la série ou la saison
  navigateToSeries() {
  // Utiliser la route correcte selon app.routes.ts
  this.router.navigate(['/serie/detail', this.tvShowId]);
}

navigateToSeason() {
  // Utiliser la route correcte selon app.routes.ts
  this.router.navigate(['/tv', this.tvShowId, 'season', this.seasonNumber]);
}
  // Formater la durée
  formatRuntime(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  // Formater la date
  formatAirDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
