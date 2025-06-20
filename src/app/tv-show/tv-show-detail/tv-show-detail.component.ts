import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SerieService } from '../../services/serie.service';
import { UserMediaInteractionsService, UserMediaInteraction } from '../../services/userMediaInteractions.service';
import { AuthService } from '../../services/auth.service';
import { ArrowLeft, Star, ChevronRight, MessageSquare, Trash2 } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { RatingModalComponent } from '../../shared/rating-modal/rating-modal.component';
import { DeleteConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

interface TvShowDetail {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  tagline: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  episode_run_time: number[];
  number_of_seasons: number;
  seasons: Season[];
  created_by: Creator[];
  networks: Network[];
  status: string;
  next_episode_to_air?: {
    air_date: string;
    episode_number: number;
    name: string;
  };
  genres: {
    id: number;
    name: string;
  }[];
}

@Component({
  selector: 'app-tv-show-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RatingModalComponent, DeleteConfirmationModalComponent],
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.css']
})
export class TvShowDetailComponent implements OnInit {
  tvShow?: TvShowDetail;
  loading = true;
  error = '';

  // Propriétés pour les interactions utilisateur
  currentUser: any = null;
  userInteraction: UserMediaInteraction | null = null;
  showRatingModal = false;

  // Propriétés pour la suppression
  showDeleteModal = false;
  isDeleting = false;

  // Lucide icons
  ArrowLeft = ArrowLeft;
  Star = Star;
  ChevronRight = ChevronRight;
  MessageSquare = MessageSquare;
  Trash2 = Trash2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: SerieService,
    private userMediaInteractionsService: UserMediaInteractionsService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    // Charger l'utilisateur actuel
    await this.loadCurrentUser();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadTvShowDetails(id);
      } else {
        this.error = 'ID de serie TV inválido';
        this.loading = false;
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

  loadTvShowDetails(id: string): void {
    this.tvShowService.getTvShowDetail(id).subscribe({
      next: (data) => {
        this.tvShow = data as TvShowDetail;
        this.loading = false;

        // Charger l'interaction utilisateur si l'utilisateur est connecté
        if (this.currentUser) {
          this.loadUserInteraction();
        }
      },
      error: (error) => {
        this.error = 'Error al cargar los detalles de la serie TV';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadUserInteraction() {
    if (!this.currentUser || !this.tvShow) return;

    this.userMediaInteractionsService.getUserMediaInteraction(
      this.currentUser.id,
      this.tvShow.id,
      'tv'  // Type 'tv' pour les séries
    ).subscribe({
      next: (interaction) => {
        this.userInteraction = interaction;
      },
      error: (error) => {
        console.log('No existing interaction found (normal for new ratings):', error.status);
        this.userInteraction = null;
      }
    });
  }

  openRatingModal() {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para evaluar esta serie');
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

  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster+Available';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getYear(date: string): string {
    return date ? new Date(date).getFullYear().toString() : 'N/A';
  }

  formatRuntime(minutes: number[]): string {
    if (!minutes || minutes.length === 0) return 'N/A';

    const runtime = minutes[0];
    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;

    if (hours > 0) {
      return `${hours}h ${mins}min`;
    } else {
      return `${mins}min`;
    }
  }

  goBack(): void {
    window.history.back();
  }

  getSortedSeasons(): Season[] {
    if (!this.tvShow || !this.tvShow.seasons) {
      return [];
    }

    // Create a copy of seasons array to avoid modifying the original
    return [...this.tvShow.seasons].sort((a, b) => {
      // First, handle cases where air_date might be missing
      if (!a.air_date) return 1;  // Put items without date at the end
      if (!b.air_date) return -1;

      // Sort by air_date in descending order (newest first)
      return new Date(b.air_date).getTime() - new Date(a.air_date).getTime();
    });
  }

  navigateToSeason(showId: number, seasonNumber: number): void {
    this.router.navigate(['/tv', showId, 'season', seasonNumber]);
  }
}
