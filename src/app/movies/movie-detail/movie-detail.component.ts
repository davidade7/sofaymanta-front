// filepath: c:\Users\Usuario\Documents\David\Code\sofaymanta-frontend\src\app\movies\movie-detail\movie-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Star, MessageSquare } from 'lucide-angular';
import { MovieService } from '../../services/movie.service';
import { UserMediaInteractionsService, UserMediaInteraction } from '../../services/userMediaInteractions.service';
import { AuthService } from '../../services/auth.service';
import { RatingModalComponent } from '../../shared/rating-modal/rating-modal.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RatingModalComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  // Icônes disponibles pour le template
  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly MessageSquare = MessageSquare;

  movie: any = null;
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  userInteraction: UserMediaInteraction | null = null;
  showRatingModal = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private userMediaInteractionsService: UserMediaInteractionsService,
    private authService: AuthService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    // Load the current user
    await this.loadCurrentUser();

    // Load the movie
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovie(id);
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
      console.log('Utilisador no autenticado o error al cargar el usuario', error);
    }
  }


  loadMovie(id: string): void {
    this.loading = true;
    this.movieService.getMovieDetail(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.loading = false;

        // Load user interaction if the user is authenticated
        if (this.currentUser) {
          this.loadUserInteraction();
        }
      },
      error: (err) => {
        console.error('Error loading movie details', err);
        this.error = 'Error al cargar los detalles del film';
        this.loading = false;
      }
    });
  }

  loadUserInteraction() {
    if (!this.currentUser || !this.movie) return;

    this.userMediaInteractionsService.getUserMediaInteraction(
      this.currentUser.id,
      this.movie.id,
      'movie'
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
      alert('Debes iniciar sesión para evaluar esta película');
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

  goBack(): void {
    this.location.back();
  }

  getLanguageName(languageCode: string): string {
    const languages: { [key: string]: string } = {
      'en': 'Inglés',
      'es': 'Español',
      'fr': 'Francés',
      'de': 'Alemán',
      'it': 'Italiano',
      'pt': 'Portugués',
      'ru': 'Ruso',
      'ja': 'Japonés',
      'ko': 'Coreano',
      'zh': 'Chino',
      'ar': 'Árabe',
      'hi': 'Hindi',
      'th': 'Tailandés',
      'tr': 'Turco',
      'pl': 'Polaco',
      'nl': 'Holandés',
      'sv': 'Sueco',
      'da': 'Danés',
      'no': 'Noruego',
      'fi': 'Finlandés',
      'cs': 'Checo',
      'hu': 'Húngaro',
      'ro': 'Rumano',
      'bg': 'Búlgaro',
      'hr': 'Croata',
      'sk': 'Eslovaco',
      'sl': 'Esloveno',
      'et': 'Estonio',
      'lv': 'Letón',
      'lt': 'Lituano',
      'uk': 'Ucraniano',
      'he': 'Hebreo',
      'fa': 'Persa',
      'ur': 'Urdu',
      'bn': 'Bengalí',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'gu': 'Gujarati',
      'pa': 'Punjabi',
      'mr': 'Marathi',
      'ne': 'Nepalí',
      'si': 'Cingalés',
      'my': 'Birmano',
      'km': 'Jemer',
      'lo': 'Lao',
      'vi': 'Vietnamita',
      'id': 'Indonesio',
      'ms': 'Malayo',
      'tl': 'Filipino',
      'sw': 'Suajili',
      'am': 'Amárico',
      'zu': 'Zulú',
      'af': 'Afrikáans',
      'sq': 'Albanés',
      'eu': 'Euskera',
      'be': 'Bielorruso',
      'bs': 'Bosnio',
      'ca': 'Catalán',
      'cy': 'Galés',
      'ga': 'Irlandés',
      'gl': 'Gallego',
      'is': 'Islandés',
      'mt': 'Maltés',
      'mk': 'Macedonio',
      'sr': 'Serbio',
      'me': 'Montenegrino'
    };

    return languages[languageCode] || languageCode.toUpperCase();
  }
}
