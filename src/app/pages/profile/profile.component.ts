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

  // Almacenamiento temporal del ID de usuario
  userId: string = '';

  // Géneros disponibles (obtenidos del GenreService)
  availableMovieGenres: any[] = [];
  availableTvGenres: any[] = [];

  // Evaluaciones del usuario
  userInteractions: UserMediaInteraction[] = [];

  // Plataformas disponibles (obtenidas del servicio)
  availablePlatforms: StreamingPlatform[] = [];

  showDeleteModal = false;
  interactionToDelete: UserMediaInteraction | null = null;
  isDeletingInteraction = false;

  // Paginación para las evaluaciones
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
  ) { }

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
    // Cargar todos los géneros disponibles desde GenreService
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
          console.error('Error al cargar las plataformas:', error);
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
        throw new Error('Usuario no conectado');
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
            // Cargar las interacciones después de cargar el perfil
            this.loadUserInteractions();
          },
          error: (error) => {
            console.log('No se encontró perfil o error:', error);
            this.isLoading = false;
          },
        });
    } catch (error) {
      console.error('Error al obtener el ID de usuario:', error);
      this.isLoading = false;
      this.profileUpdateError =
        'No se pueden cargar los datos del usuario. Por favor, inicia sesión.';
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
          console.error('Error al cargar las interacciones:', error);
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
          console.error('Error al crear el perfil:', error);
          this.profileUpdateError = error.message || 'Error al crear el perfil';
        },
      });
  }

  updateProfile(profileData: any) {
    if (!this.userProfile?.id) {
      this.profileUpdateError =
        'No se puede actualizar el perfil: ID no encontrado';
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
          console.log('Perfil actualizado con éxito:', profile);
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          this.profileUpdateError =
            error.message || 'Error al actualizar el perfil';
        },
      });
  }

  // === Métodos para géneros favoritos ===

  addFavoriteGenre(genreId: number, mediaType: 'movie' | 'tv') {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .addFavoriteGenre(this.userProfile.id, genreId, mediaType)
      .subscribe({
        next: () => {
          if (mediaType === 'movie') {
            this.userProfile!.favorite_movie_genres = [
              ...(this.userProfile!.favorite_movie_genres || []),
              genreId
            ];
          } else {
            this.userProfile!.favorite_tv_genres = [
              ...(this.userProfile!.favorite_tv_genres || []),
              genreId
            ];
          }
        },
        error: (error) => {
          console.error('Error al agregar el género:', error);
        },
      });
  }

  removeFavoriteGenre(genreId: number, mediaType: 'movie' | 'tv') {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .removeFavoriteGenre(this.userProfile.id, genreId, mediaType)
      .subscribe({
        next: () => {
          if (mediaType === 'movie') {
            this.userProfile!.favorite_movie_genres = (this.userProfile!.favorite_movie_genres || []).filter(id => id !== genreId);
          } else {
            this.userProfile!.favorite_tv_genres = (this.userProfile!.favorite_tv_genres || []).filter(id => id !== genreId);
          }
        },
        error: (error) => {
          console.error('Error al eliminar el género:', error);
        },
      });
  }

  isMovieGenreFavorite(genreId: number): boolean {
    return this.userProfile?.favorite_movie_genres?.includes(genreId) || false;
  }

  isTvGenreFavorite(genreId: number): boolean {
    return this.userProfile?.favorite_tv_genres?.includes(genreId) || false;
  }

  // Usar GenreService para obtener el nombre de un género
  getGenreName(genreId: number, mediaType: 'movie' | 'tv'): string {
    return this.genreService.getGenreObject(genreId, mediaType === 'movie')
      .name;
  }

  // Obtener los objetos de géneros completos para mostrar favoritos
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

  // === Métodos para plataformas de streaming ===
  addStreamingPlatform(platformCode: string) {
    if (!this.userProfile?.id) return;

    this.userProfileService
      .addStreamingPlatform(this.userProfile.id, platformCode)
      .subscribe({
        next: () => {
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Error al agregar la plataforma:', error);
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
          console.error('Error al eliminar la plataforma:', error);
        },
      });
  }

  isPlatformSelected(platformCode: string): boolean {
    return (
      this.userProfile?.streaming_platforms?.includes(platformCode) || false
    );
  }

  // Obtener las plataformas seleccionadas para mostrar
  getSelectedPlatforms(): StreamingPlatform[] {
    if (!this.userProfile?.streaming_platforms) return [];
    return this.availablePlatforms.filter((platform) =>
      this.userProfile!.streaming_platforms!.includes(platform.code)
    );
  }

  // Obtener el nombre de una plataforma por su código
  getPlatformName(code: string): string {
    const platform = this.availablePlatforms.find((p) => p.code === code);
    return platform ? platform.name : code;
  }

  // === Métodos para interacciones de usuario ===

  // Obtener el enlace al detalle del medio
  getMediaDetailLink(interaction: UserMediaInteraction): string {
    if (interaction.media_type === 'movie') {
      return `/movie/detail/${interaction.media_id}`;
    } else if (interaction.media_type === 'tv') {
      // Si es un episodio (con season/episode)
      if (interaction.season_number && interaction.episode_number) {
        return `/tv/${interaction.media_id}/season/${interaction.season_number}/episode/${interaction.episode_number}`;
      }
      // Si no, es una serie
      return `/serie/detail/${interaction.media_id}`;
    }
    return `/`;
  }

  // Obtener el nombre del tipo de medio para mostrar
  getMediaTypeName(interaction: UserMediaInteraction): string {
    if (interaction.media_type === 'movie') {
      return 'Película';
    } else if (interaction.media_type === 'tv') {
      // Si es una serie con season/episode, es un episodio
      if (interaction.season_number && interaction.episode_number) {
        return 'Episodio';
      }
      return 'Serie';
    }
    return 'Desconocido';
  }

  // Filtrar interacciones por tipo
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

  // Obtener solo las interacciones con rating
  getRatedInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) =>
        interaction.rating !== undefined && interaction.rating > 0
    );
  }

  // Obtener solo las interacciones con comentario
  getCommentedInteractions(): UserMediaInteraction[] {
    return this.userInteractions.filter(
      (interaction) => interaction.comment && interaction.comment.trim() !== ''
    );
  }

  // Método para formatear la visualización de episodios
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

  // Verificar si es un episodio
  isEpisodeInteraction(interaction: UserMediaInteraction): boolean {
    return (
      interaction.media_type === 'tv' &&
      interaction.season_number !== undefined &&
      interaction.episode_number !== undefined
    );
  }

  // Eliminar una interacción
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
          console.log('Interacción eliminada:', response);
          // Quitar la interacción de la lista local
          this.userInteractions = this.userInteractions.filter(
            (i) => i.id !== this.interactionToDelete!.id
          );
          this.cancelDeleteInteraction();
        },
        error: (error) => {
          console.error('Error al eliminar la evaluación:', error);
          this.isDeletingInteraction = false;
          alert('Error al eliminar la evaluación. Intenta de nuevo.');
        },
      });
  }

  // Cancelar la eliminación
  cancelDeleteInteraction() {
    this.showDeleteModal = false;
    this.interactionToDelete = null;
    this.isDeletingInteraction = false;
  }

  // Generar el mensaje de confirmación
  getDeleteMessage(): string {
    if (!this.interactionToDelete) return '';

    let title = '';
    if (
      this.interactionToDelete.media_type === 'tv' &&
      this.interactionToDelete.season_number &&
      this.interactionToDelete.episode_number
    ) {
      // Es un episodio
      title = `episodio T${this.interactionToDelete.season_number}E${this.interactionToDelete.episode_number} de la serie (ID: ${this.interactionToDelete.media_id})`;
    } else {
      // Es una película o serie
      const mediaTypeName = this.getMediaTypeName(this.interactionToDelete);
      title = `${mediaTypeName.toLowerCase()} (ID: ${this.interactionToDelete.media_id
        })`;
    }

    return `¿Estás seguro de que quieres eliminar tu evaluación de este ${title}?`;
  }

  // Métodos para la paginación de evaluaciones
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
