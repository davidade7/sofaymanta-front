import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  UserProfileService,
  UserProfile,
} from '../../services/userProfile.service';
import {
  UserMediaInteractionsService,
  UserMediaInteraction,
} from '../../services/userMediaInteractions.service';
import { GenreService } from '../../services/genre.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  LucideAngularModule,
  Save,
  Loader2,
  Plus,
  X,
  Star,
  MessageCircle,
  ExternalLink,
  Trash2,
} from 'lucide-angular';
import { DeleteConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { finalize } from 'rxjs/operators';
import { StreamingPlatformService } from '../../services/streamingPlatform.service';
import { StreamingPlatform } from '../../models/streaming-platform.model';
import { DeleteAccountComponent } from '../../components/delete-account/delete-account.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterModule,
    DeleteConfirmationModalComponent,
    DeleteAccountComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: UserProfile | null = null;

  isLoading = true;
  isCreatingProfile = false;
  isUpdatingProfile = false;
  isLoadingInteractions = false;
  isLoadingPlatforms = false;

  profileUpdateSuccess = false;
  profileUpdateError = '';

  Save = Save;
  Loader2 = Loader2;
  Plus = Plus;
  X = X;
  Star = Star;
  MessageCircle = MessageCircle;
  ExternalLink = ExternalLink;
  Trash2 = Trash2;

  // Stockage temporaire de l'ID utilisateur
  userId: string = '';

  // Genres disponibles (récupérés du GenreService)
  availableMovieGenres: any[] = [];
  availableTvGenres: any[] = [];

  // Évaluations de l'utilisateur
  userInteractions: UserMediaInteraction[] = [];

  // Plateformes disponibles (récupérées du service)
  availablePlatforms: StreamingPlatform[] = [];

  showDeleteModal = false;
  interactionToDelete: UserMediaInteraction | null = null;
  isDeletingInteraction = false;

  // Pagination pour les évaluations
  showAllInteractions = false;
  readonly INTERACTIONS_LIMIT = 5;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private genreService: GenreService,
    private userMediaInteractionsService: UserMediaInteractionsService,
    private streamingPlatformService: StreamingPlatformService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadGenres();
    this.loadUserProfile();
    this.loadStreamingPlatforms();
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  loadGenres() {
    // Charger tous les genres disponibles depuis le GenreService
    const movieGenreIds = [
      28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878,
      10770, 53, 10752, 37,
    ];
    const tvGenreIds = [
      10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766,
      10767, 10768, 37,
    ];

    this.availableMovieGenres = movieGenreIds.map((id) =>
      this.genreService.getGenreObject(id, true)
    );
    this.availableTvGenres = tvGenreIds.map((id) =>
      this.genreService.getGenreObject(id, false)
    );
  }

  loadStreamingPlatforms() {
    this.isLoadingPlatforms = true;
    this.streamingPlatformService
      .findAll(true)
      .pipe(finalize(() => (this.isLoadingPlatforms = false)))
      .subscribe({
        next: (platforms) => {
          this.availablePlatforms = platforms;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des plateformes:', error);
        },
      });
  }

  async loadUserProfile() {
    this.isLoading = true;

    try {
      const { data, error } = await this.authService.getUser();

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Utilisateur non connecté');
      }

      this.userId = data.user.id;

      this.userProfileService
        .getUserProfile(this.userId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (profile) => {
            this.userProfile = profile;
            this.profileForm.patchValue({
              username: profile.username,
            });
            // Charger les interactions après avoir chargé le profil
            this.loadUserInteractions();
          },
          error: (error) => {
            console.log('Aucun profil trouvé ou erreur:', error);
            this.isLoading = false;
          },
        });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'ID utilisateur:",
        error
      );
      this.isLoading = false;
      this.profileUpdateError =
        'Impossible de charger les données utilisateur. Veuillez vous connecter.';
      this.router.navigate(['/signin']);
    }
  }

  loadUserInteractions() {
    if (!this.userId) return;

    this.isLoadingInteractions = true;
    this.userMediaInteractionsService
      .getUserInteractions(this.userId)
      .pipe(finalize(() => (this.isLoadingInteractions = false)))
      .subscribe({
        next: (interactions) => {
          this.userInteractions = interactions.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        },
        error: (error) => {
          console.error('Erreur lors du chargement des interactions:', error);
        },
      });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    const profileData = {
      username: this.profileForm.value.username,
    };

    if (this.userProfile) {
      this.updateProfile(profileData);
    } else {
      this.createProfile(profileData);
    }
  }

  createProfile(profileData: any) {
    this.isCreatingProfile = true;
    this.profileUpdateSuccess = false;
    this.profileUpdateError = '';

    this.userProfileService
      .createUserProfile(this.userId, profileData)
      .pipe(finalize(() => (this.isCreatingProfile = false)))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.profileUpdateSuccess = true;
        },
        error: (error) => {
          console.error('Erreur lors de la création du profil:', error);
          this.profileUpdateError =
            error.message || 'Erreur lors de la création du profil';
        },
      });
  }

  updateProfile(profileData: any) {
    if (!this.userProfile?.id) {
      this.profileUpdateError =
        'Impossible de mettre à jour le profil: ID introuvable';
      return;
    }

    this.isUpdatingProfile = true;
    this.profileUpdateSuccess = false;
    this.profileUpdateError = '';

    const updatedProfile: Partial<UserProfile> = {
      username: profileData.username,
    };

    this.userProfileService
      .updateUserProfile(this.userProfile.id, updatedProfile)
      .pipe(finalize(() => (this.isUpdatingProfile = false)))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.profileUpdateSuccess = true;
          console.log('Profil mis à jour avec succès:', profile);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          this.profileUpdateError =
            error.message || 'Erreur lors de la mise à jour du profil';
        },
      });
  }

  // === Méthodes pour les genres favoris ===

  addFavoriteGenre(genreId: number, mediaType: 'movie' | 'tv') {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .addFavoriteGenre(this.userProfile.id, genreId, mediaType)
      .subscribe({
        next: () => {
          this.loadUserProfile();
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du genre:", error);
        },
      });
  }

  removeFavoriteGenre(genreId: number, mediaType: 'movie' | 'tv') {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .removeFavoriteGenre(this.userProfile.id, genreId, mediaType)
      .subscribe({
        next: () => {
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du genre:', error);
        },
      });
  }

  isMovieGenreFavorite(genreId: number): boolean {
    return this.userProfile?.favorite_movie_genres?.includes(genreId) || false;
  }

  isTvGenreFavorite(genreId: number): boolean {
    return this.userProfile?.favorite_tv_genres?.includes(genreId) || false;
  }

  // Utiliser le GenreService pour obtenir le nom d'un genre
  getGenreName(genreId: number, mediaType: 'movie' | 'tv'): string {
    return this.genreService.getGenreObject(genreId, mediaType === 'movie')
      .name;
  }

  // Obtenir les objets genres complets pour l'affichage des favoris
  getFavoriteMovieGenres(): any[] {
    if (!this.userProfile?.favorite_movie_genres) return [];
    return this.genreService.getGenresFromIds(
      this.userProfile.favorite_movie_genres,
      true
    );
  }

  getFavoriteTvGenres(): any[] {
    if (!this.userProfile?.favorite_tv_genres) return [];
    return this.genreService.getGenresFromIds(
      this.userProfile.favorite_tv_genres,
      false
    );
  }

  // === Méthodes pour les plateformes de streaming ===
  addStreamingPlatform(platformCode: string) {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .addStreamingPlatform(this.userProfile.id, platformCode)
      .subscribe({
        next: () => {
          this.loadUserProfile();
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout de la plateforme:", error);
        },
      });
  }

  removeStreamingPlatform(platformCode: string) {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .removeStreamingPlatform(this.userProfile.id, platformCode)
      .subscribe({
        next: () => {
          this.loadUserProfile();
        },
        error: (error) => {
          console.error(
            'Erreur lors de la suppression de la plateforme:',
            error
          );
        },
      });
  }

  isPlatformSelected(platformCode: string): boolean {
    return (
      this.userProfile?.streaming_platforms?.includes(platformCode) || false
    );
  }

  // Obtenir les plateformes sélectionnées pour l'affichage
  getSelectedPlatforms(): StreamingPlatform[] {
    if (!this.userProfile?.streaming_platforms) return [];
    return this.availablePlatforms.filter((platform) =>
      this.userProfile!.streaming_platforms!.includes(platform.code)
    );
  }

  // Obtenir le nom d'une plateforme par son code
  getPlatformName(code: string): string {
    const platform = this.availablePlatforms.find((p) => p.code === code);
    return platform ? platform.name : code;
  }

  // === Méthodes pour les interactions utilisateur ===

  // Obtenir le lien vers le détail du média
  getMediaDetailLink(interaction: UserMediaInteraction): string {
    if (interaction.media_type === 'movie') {
      return `/movie/detail/${interaction.media_id}`;
    } else if (interaction.media_type === 'tv') {
      // Si c'est un épisode (avec season/episode)
      if (interaction.season_number && interaction.episode_number) {
        return `/tv/${interaction.media_id}/season/${interaction.season_number}/episode/${interaction.episode_number}`;
      }
      // Sinon c'est une série
      return `/serie/detail/${interaction.media_id}`;
    }
    return `/`;
  }

  // Obtenir le nom du type de média pour l'affichage
  getMediaTypeName(interaction: UserMediaInteraction): string {
    if (interaction.media_type === 'movie') {
      return 'Película';
    } else if (interaction.media_type === 'tv') {
      // Si c'est une série avec season/episode, c'est un épisode
      if (interaction.season_number && interaction.episode_number) {
        return 'Episodio';
      }
      return 'Serie';
    }
    return 'Desconocido';
  }

  // Filtrer les interactions par type
  getMovieInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) => interaction.media_type === 'movie'
    );
  }

  getTvInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) =>
        interaction.media_type === 'tv' &&
        (!interaction.season_number || !interaction.episode_number)
    );
  }

  getEpisodeInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) =>
        interaction.media_type === 'tv' &&
        interaction.season_number &&
        interaction.episode_number
    );
  }

  // Obtenir les interactions avec rating seulement
  getRatedInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) =>
        interaction.rating !== undefined && interaction.rating > 0
    );
  }

  // Obtenir les interactions avec commentaire seulement
  getCommentedInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) => interaction.comment && interaction.comment.trim() !== ''
    );
  }

  // Méthode pour formater l'affichage des épisodes
  getEpisodeDisplayTitle(interaction: UserMediaInteraction): string {
    if (
      interaction.media_type === 'tv' &&
      interaction.season_number &&
      interaction.episode_number
    ) {
      return `T${interaction.season_number}E${interaction.episode_number}`;
    }
    return '';
  }

  // Vérifier si c'est un épisode
  isEpisodeInteraction(interaction: UserMediaInteraction): boolean {
    return (
      interaction.media_type === 'tv' &&
      interaction.season_number !== undefined &&
      interaction.episode_number !== undefined
    );
  }

  // Supprimer une interaction
  prepareDeleteInteraction(interaction: UserMediaInteraction) {
    this.interactionToDelete = interaction;
    this.showDeleteModal = true;
  }

  confirmDeleteInteraction() {
    if (!this.interactionToDelete) return;

    this.isDeletingInteraction = true;

    this.userMediaInteractionsService
      .deleteInteraction(this.interactionToDelete.id, this.userId)
      .subscribe({
        next: (response) => {
          console.log('Interaction supprimée:', response);
          // Retirer l'interaction de la liste locale
          this.userInteractions = this.userInteractions.filter(
            (i) => i.id !== this.interactionToDelete!.id
          );
          this.cancelDeleteInteraction();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.isDeletingInteraction = false;
          alert('Error al eliminar la evaluación. Intenta de nuevo.');
        },
      });
  }

  // Annuler la suppression
  cancelDeleteInteraction() {
    this.showDeleteModal = false;
    this.interactionToDelete = null;
    this.isDeletingInteraction = false;
  }

  // Générer le message de confirmation
  getDeleteMessage(): string {
    if (!this.interactionToDelete) return '';

    let title = '';
    if (
      this.interactionToDelete.media_type === 'tv' &&
      this.interactionToDelete.season_number &&
      this.interactionToDelete.episode_number
    ) {
      // C'est un épisode
      title = `episodio T${this.interactionToDelete.season_number}E${this.interactionToDelete.episode_number} de la serie (ID: ${this.interactionToDelete.media_id})`;
    } else {
      // C'est un film ou une série
      const mediaTypeName = this.getMediaTypeName(this.interactionToDelete);
      title = `${mediaTypeName.toLowerCase()} (ID: ${
        this.interactionToDelete.media_id
      })`;
    }

    return `¿Estás seguro de que quieres eliminar tu evaluación de este ${title}?`;
  }

  // Méthodes pour la pagination des évaluations
  getDisplayedInteractions(): UserMediaInteraction[] {
    if (this.showAllInteractions) {
      return this.userInteractions;
    }
    return this.userInteractions.slice(0, this.INTERACTIONS_LIMIT);
  }

  toggleShowAllInteractions(): void {
    this.showAllInteractions = !this.showAllInteractions;
  }

  shouldShowMoreButton(): boolean {
    return (
      !this.showAllInteractions &&
      this.userInteractions.length > this.INTERACTIONS_LIMIT
    );
  }

  shouldShowLessButton(): boolean {
    return (
      this.showAllInteractions &&
      this.userInteractions.length > this.INTERACTIONS_LIMIT
    );
  }
}
