import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService, UserProfile } from '../../services/userProfile.service';
import { UserMediaInteractionsService, UserMediaInteraction } from '../../services/userMediaInteractions.service';
import { GenreService } from '../../services/genre.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Save, Loader2, Plus, X, Star, MessageCircle, ExternalLink, Trash2 } from 'lucide-angular';
import { DeleteConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule, DeleteConfirmationModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: UserProfile | null = null;

  isLoading = true;
  isCreatingProfile = false;
  isUpdatingProfile = false;
  isLoadingInteractions = false;

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

  // Plateformes disponibles avec label : valeur
  availablePlatforms = {
    'Netflix': 'netflix',
    'Prime Video': 'prime_video',
    'Disney+': 'disney_plus',
    'HBO Max': 'hbo_max',
    'Apple TV+': 'apple_tv',
    'Paramount+': 'paramount_plus',
    'Hulu': 'hulu',
    'Peacock': 'peacock',
    'Crunchyroll': 'crunchyroll',
    'Filmin': 'filmin',
    'Movistar+': 'movistar_plus'
  };

  showDeleteModal = false;
  interactionToDelete: UserMediaInteraction | null = null;
  isDeletingInteraction = false;

  constructor(
  private fb: FormBuilder,
  private userProfileService: UserProfileService,
  private genreService: GenreService,
  private userMediaInteractionsService: UserMediaInteractionsService, // <- Ajout de cette ligne
  private authService: AuthService,
  private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadGenres();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadGenres() {
    // Charger tous les genres disponibles depuis le GenreService
    const movieGenreIds = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
    const tvGenreIds = [10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766, 10767, 10768, 37];

    this.availableMovieGenres = movieGenreIds.map(id => this.genreService.getGenreObject(id, true));
    this.availableTvGenres = tvGenreIds.map(id => this.genreService.getGenreObject(id, false));
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

      this.userProfileService.getUserProfile(this.userId).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: profile => {
          this.userProfile = profile;
          this.profileForm.patchValue({
            username: profile.username
          });
          // Charger les interactions après avoir chargé le profil
          this.loadUserInteractions();
        },
        error: error => {
          console.log('Aucun profil trouvé ou erreur:', error);
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      this.isLoading = false;
      this.profileUpdateError = 'Impossible de charger les données utilisateur. Veuillez vous connecter.';
      this.router.navigate(['/signin']);
    }
  }

  loadUserInteractions() {
    if (!this.userId) return;

    this.isLoadingInteractions = true;
    this.userMediaInteractionsService.getUserInteractions(this.userId).pipe(
      finalize(() => this.isLoadingInteractions = false)
    ).subscribe({
      next: interactions => {
        this.userInteractions = interactions.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: error => {
        console.error('Erreur lors du chargement des interactions:', error);
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    const profileData = {
      username: this.profileForm.value.username
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

    this.userProfileService.createUserProfile(this.userId, profileData).pipe(
      finalize(() => this.isCreatingProfile = false)
    ).subscribe({
      next: profile => {
        this.userProfile = profile;
        this.profileUpdateSuccess = true;
      },
      error: error => {
        console.error('Erreur lors de la création du profil:', error);
        this.profileUpdateError = error.message || 'Erreur lors de la création du profil';
      }
    });
  }

  updateProfile(profileData: any) {
    if (!this.userProfile?.id) {
      this.profileUpdateError = 'Impossible de mettre à jour le profil: ID introuvable';
      return;
    }

    this.isUpdatingProfile = true;
    this.profileUpdateSuccess = false;
    this.profileUpdateError = '';

    const updatedProfile: Partial<UserProfile> = {
      username: profileData.username
    };

    this.userProfileService.updateUserProfile(this.userProfile.id, updatedProfile).pipe(
      finalize(() => this.isUpdatingProfile = false)
    ).subscribe({
      next: profile => {
        this.userProfile = profile;
        this.profileUpdateSuccess = true;
        console.log('Profil mis à jour avec succès:', profile);
      },
      error: error => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.profileUpdateError = error.message || 'Erreur lors de la mise à jour du profil';
      }
    });
  }

  // === Méthodes pour les genres favoris ===

  addFavoriteGenre(genreId: number, mediaType: 'movie' | 'tv') {
    if (!this.userProfile?.id) return;

    this.userProfileService.addFavoriteGenre(this.userProfile.id, genreId, mediaType).subscribe({
      next: () => {
        this.loadUserProfile();
      },
      error: error => {
        console.error('Erreur lors de l\'ajout du genre:', error);
      }
    });
  }

  removeFavoriteGenre(genreId: number, mediaType: 'movie' | 'tv') {
    if (!this.userProfile?.id) return;

    this.userProfileService.removeFavoriteGenre(this.userProfile.id, genreId, mediaType).subscribe({
      next: () => {
        this.loadUserProfile();
      },
      error: error => {
        console.error('Erreur lors de la suppression du genre:', error);
      }
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
    return this.genreService.getGenreObject(genreId, mediaType === 'movie').name;
  }

  // Obtenir les objets genres complets pour l'affichage des favoris
  getFavoriteMovieGenres(): any[] {
    if (!this.userProfile?.favorite_movie_genres) return [];
    return this.genreService.getGenresFromIds(this.userProfile.favorite_movie_genres, true);
  }

  getFavoriteTvGenres(): any[] {
    if (!this.userProfile?.favorite_tv_genres) return [];
    return this.genreService.getGenresFromIds(this.userProfile.favorite_tv_genres, false);
  }

  // === Méthodes pour les plateformes de streaming ===

  addStreamingPlatform(platformValue: string) {
    if (!this.userProfile?.id) return;

    this.userProfileService.addStreamingPlatform(this.userProfile.id, platformValue).subscribe({
      next: () => {
        this.loadUserProfile();
      },
      error: error => {
        console.error('Erreur lors de l\'ajout de la plateforme:', error);
      }
    });
  }

  removeStreamingPlatform(platformValue: string) {
    if (!this.userProfile?.id) return;

    this.userProfileService.removeStreamingPlatform(this.userProfile.id, platformValue).subscribe({
      next: () => {
        this.loadUserProfile();
      },
      error: error => {
        console.error('Erreur lors de la suppression de la plateforme:', error);
      }
    });
  }

  isPlatformSelected(platformValue: string): boolean {
    return this.userProfile?.streaming_platforms?.includes(platformValue) || false;
  }

  // Méthodes utilitaires pour gérer l'objet plateformes
  getPlatformLabels(): string[] {
    return Object.keys(this.availablePlatforms);
  }

  getPlatformValue(label: string): string {
    return this.availablePlatforms[label as keyof typeof this.availablePlatforms];
  }

  getPlatformLabel(value: string): string {
    const entry = Object.entries(this.availablePlatforms).find(([_, val]) => val === value);
    return entry ? entry[0] : value;
  }

  // Obtenir les labels des plateformes sélectionnées pour l'affichage
  getSelectedPlatformLabels(): string[] {
    if (!this.userProfile?.streaming_platforms) return [];
    return this.userProfile.streaming_platforms.map(platform => this.getPlatformLabel(platform));
  }

  // === Méthodes pour les interactions utilisateur ===

  // Obtenir le lien vers le détail du média
  getMediaDetailLink(interaction: UserMediaInteraction): string {
    if (interaction.media_type === 'movie') {
      return `/movie/detail/${interaction.media_id}`;
    } else {
      return `/serie/detail/${interaction.media_id}`;
    }
  }

  // Obtenir le nom du type de média pour l'affichage
  getMediaTypeName(mediaType: 'movie' | 'tv'): string {
    return mediaType === 'movie' ? 'Película' : 'Serie';
  }

  // Filtrer les interactions par type
  getMovieInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(interaction => interaction.media_type === 'movie');
  }

  getTvInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(interaction => interaction.media_type === 'tv');
  }

  // Obtenir les interactions avec rating seulement
  getRatedInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(interaction => interaction.rating !== undefined && interaction.rating > 0);
  }

  // Obtenir les interactions avec commentaire seulement
  getCommentedInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(interaction => interaction.comment && interaction.comment.trim() !== '');
  }

  // Supprimer une interaction
  prepareDeleteInteraction(interaction: UserMediaInteraction) {
    this.interactionToDelete = interaction;
    this.showDeleteModal = true;
  }

  confirmDeleteInteraction() {
    if (!this.interactionToDelete) return;

    this.isDeletingInteraction = true;

    this.userMediaInteractionsService.deleteInteraction(
      this.interactionToDelete.id,
      this.userId
    ).subscribe({
      next: (response) => {
        console.log('Interaction supprimée:', response);
        // Retirer l'interaction de la liste locale
        this.userInteractions = this.userInteractions.filter(
          i => i.id !== this.interactionToDelete!.id
        );
        this.cancelDeleteInteraction();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.isDeletingInteraction = false;
        alert('Error al eliminar la evaluación. Intenta de nuevo.');
      }
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
    const mediaType = this.getMediaTypeName(this.interactionToDelete.media_type).toLowerCase();
    return `¿Estás seguro de que quieres eliminar tu evaluación de esta ${mediaType} (ID: ${this.interactionToDelete.media_id})?`;
  }
}
