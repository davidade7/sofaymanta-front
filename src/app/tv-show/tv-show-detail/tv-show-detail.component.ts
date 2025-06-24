import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Star } from 'lucide-angular';
import { SerieService } from '../../services/serie.service';
import {
  UserMediaInteractionsService,
  UserMediaInteraction,
} from '../../services/userMediaInteractions.service';
import { AuthService } from '../../services/auth.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { TopButtonComponent } from '../../shared/top-button/top-button.component';
import { RatingComponent } from '../../shared/rating/rating.component';
import { RatingListComponent } from '../../shared/rating-list/rating-list.component';

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
  imports: [
    CommonModule,
    LucideAngularModule,
    BackButtonComponent,
    TopButtonComponent,
    RatingComponent,
    RatingListComponent,
  ],
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.css'],
})
export class TvShowDetailComponent implements OnInit {
  // Icônes disponibles pour le template
  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;

  tvShow: TvShowDetail | null = null;
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  userInteraction: UserMediaInteraction | null = null;
  allRatings: UserMediaInteraction[] = [];
  loadingRatings = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: SerieService,
    private userMediaInteractionsService: UserMediaInteractionsService,
    private authService: AuthService,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    // Charger l'utilisateur actuel
    await this.loadCurrentUser();

    // Charger la série TV
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadTvShow(id);
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

  loadTvShow(id: string): void {
    this.loading = true;
    this.tvShowService.getTvShowDetail(id).subscribe({
      next: (data) => {
        this.tvShow = data as TvShowDetail;
        this.loading = false;

        // Charger l'interaction utilisateur si connecté
        if (this.currentUser) {
          this.loadUserInteraction();
        }

        // Charger tous les ratings pour cette série
        this.loadAllRatings();
      },
      error: (err) => {
        console.error('Error loading TV show details', err);
        this.error = 'Error al cargar los detalles de la serie';
        this.loading = false;
      },
    });
  }

  loadUserInteraction() {
    if (!this.currentUser || !this.tvShow) return;

    this.userMediaInteractionsService
      .getUserMediaInteraction(this.currentUser.id, this.tvShow.id, 'tv')
      .subscribe({
        next: (interaction) => {
          this.userInteraction = interaction;
        },
        error: (error) => {
          this.userInteraction = null;
        },
      });
  }

  loadAllRatings() {
    if (!this.tvShow) return;

    this.loadingRatings = true;
    this.userMediaInteractionsService
      .getMediaRatings(this.tvShow.id, 'tv')
      .subscribe({
        next: (ratings) => {
          this.allRatings = ratings.filter(
            (rating) => rating.rating !== null && rating.rating !== undefined
          );
          this.loadingRatings = false;
        },
        error: (error) => {
          console.error('Error loading ratings:', error);
          this.allRatings = [];
          this.loadingRatings = false;
        },
      });
  }

  goBack(): void {
    this.location.back();
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

  getSortedSeasons(): Season[] {
    if (!this.tvShow || !this.tvShow.seasons) {
      return [];
    }

    return [...this.tvShow.seasons].sort((a, b) => {
      return a.season_number - b.season_number;
    });
  }

  navigateToSeason(showId: number, seasonNumber: number): void {
    this.router.navigate(['/tv', showId, 'season', seasonNumber]);
  }
}
