import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces pour typer les données
export interface CreateUserMediaInteractionDto {
  media_id: number; // Pour tv_episode, c'est l'ID de la série, pas de l'épisode
  media_type: 'movie' | 'tv';
  season_number?: number;
  episode_number?: number;
  rating?: number;
  comment?: string;
}

export interface UpdateUserMediaInteractionDto {
  rating?: number;
  comment?: string;
}

export interface UserMediaInteraction {
  id: string;
  userId: string;
  media_id: number; // Pour tv_episode, c'est l'ID de la série, pas de l'épisode
  media_type: 'movie' | 'tv';
  season_number?: number;
  episode_number?: number;
  rating?: number;
  comment?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isDeleting?: boolean;
  username?: string;
}

export interface EpisodeRating {
  episode_number: number;
  season_number: number;
  rating?: number;
  comment?: string;
  interaction?: UserMediaInteraction;
}

@Injectable({
  providedIn: 'root',
})
export class UserMediaInteractionsService {
  private apiUrl = `${environment.apiUrl}/user-media-interactions`;

  constructor(private http: HttpClient) {}

  /**
   * Crée une nouvelle interaction média pour un utilisateur
   * @param userId L'ID de l'utilisateur
   * @param interaction Les données de l'interaction à créer
   */
  createInteraction(
    userId: string,
    interaction: CreateUserMediaInteractionDto
  ): Observable<UserMediaInteraction> {
    return this.http.post<UserMediaInteraction>(
      `${this.apiUrl}/${userId}`,
      interaction
    );
  }

  /**
   * Récupère toutes les interactions d'un utilisateur
   * @param userId L'ID de l'utilisateur
   */
  getUserInteractions(userId: string): Observable<UserMediaInteraction[]> {
    return this.http.get<UserMediaInteraction[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  /**
   * Récupère l'interaction d'un utilisateur pour un média spécifique
   * @param userId L'ID de l'utilisateur
   * @param mediaId L'ID du média
   * @param mediaType Le type de média (movie, tv, ou tv_episode)
   * @param seasonNumber Numéro de saison (pour tv_episode)
   * @param episodeNumber Numéro d'épisode (pour tv_episode)
   */
  getUserMediaInteraction(
    userId: string,
    mediaId: number,
    mediaType: 'movie' | 'tv', // Seulement movie et tv
    seasonNumber?: number,
    episodeNumber?: number
  ): Observable<UserMediaInteraction> {
    let params = new HttpParams().set('mediaType', mediaType);

    if (seasonNumber !== undefined) {
      params = params.set('seasonNumber', seasonNumber.toString());
    }

    if (episodeNumber !== undefined) {
      params = params.set('episodeNumber', episodeNumber.toString());
    }

    return this.http.get<UserMediaInteraction>(
      `${this.apiUrl}/user/${userId}/media/${mediaId}/details`,
      { params }
    );
  }

  /**
   * Récupère les évaluations d'épisodes pour une série
   * @param userId L'ID de l'utilisateur
   * @param mediaId L'ID de la série
   * @param seasonNumber Numéro de saison (optionnel)
   */
  getEpisodeRatings(
    userId: string,
    mediaId: number,
    seasonNumber?: number
  ): Observable<EpisodeRating[]> {
    let params = new HttpParams();

    if (seasonNumber !== undefined) {
      params = params.set('seasonNumber', seasonNumber.toString());
    }

    return this.http.get<EpisodeRating[]>(
      `${this.apiUrl}/user/${userId}/media/${mediaId}/episodes/ratings`,
      { params }
    );
  }

  /**
   * Récupère tous les ratings d'un média (tous utilisateurs confondus)
   * @param mediaId L'ID du média
   * @param mediaType Le type de média (movie ou tv)
   * @param seasonNumber Numéro de saison (optionnel, pour les séries)
   * @param episodeNumber Numéro d'épisode (optionnel, pour les épisodes)
   */
  getMediaRatings(
    mediaId: number,
    mediaType: 'movie' | 'tv',
    seasonNumber?: number,
    episodeNumber?: number
  ): Observable<UserMediaInteraction[]> {
    let params = new HttpParams().set('mediaType', mediaType);

    if (seasonNumber !== undefined) {
      params = params.set('seasonNumber', seasonNumber.toString());
    }

    if (episodeNumber !== undefined) {
      params = params.set('episodeNumber', episodeNumber.toString());
    }

    return this.http.get<UserMediaInteraction[]>(
      `${this.apiUrl}/media/${mediaId}/ratings`,
      { params }
    );
  }

  /**
   * Récupère une interaction spécifique par son ID
   * @param interactionId L'ID de l'interaction
   */
  getInteractionById(interactionId: string): Observable<UserMediaInteraction> {
    return this.http.get<UserMediaInteraction>(
      `${this.apiUrl}/${interactionId}`
    );
  }

  /**
   * Met à jour une interaction existante
   * @param interactionId L'ID de l'interaction
   * @param userId L'ID de l'utilisateur (pour vérification)
   * @param updates Les données à mettre à jour
   */
  updateInteraction(
    interactionId: string,
    userId: string,
    updates: UpdateUserMediaInteractionDto
  ): Observable<UserMediaInteraction> {
    return this.http.patch<UserMediaInteraction>(
      `${this.apiUrl}/${interactionId}/user/${userId}`,
      updates
    );
  }

  /**
   * Supprime une interaction
   * @param interactionId L'ID de l'interaction
   * @param userId L'ID de l'utilisateur (pour vérification)
   */
  deleteInteraction(
    interactionId: string,
    userId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${interactionId}/user/${userId}`
    );
  }

  /**
   * Récupère toutes les évaluations (tous utilisateurs, toutes œuvres)
   */
  getAllRatings(): Observable<
    (UserMediaInteraction & {
      username?: string;
      media_title?: string;
      media_poster?: string;
    })[]
  > {
    return this.http.get<
      (UserMediaInteraction & {
        username?: string;
        media_title?: string;
        media_poster?: string;
      })[]
    >(`${this.apiUrl}/all/ratings`);
  }
}
