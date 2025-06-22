import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string | Date;
  updated_at: string | Date;
  favorite_movie_genres?: number[];
  favorite_tv_genres?: number[];
  streaming_platforms?: string[];
}

export interface Genre {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/user-profiles`;

  constructor(private http: HttpClient) {}
  /**
   * Récupère le profil d'un utilisateur
   * @param id L'ID du profil utilisateur
   */
  getUserProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un profil utilisateur pour un utilisateur spécifique
   * @param userId L'ID de l'utilisateur
   * @param profile Les données du profil à créer
   */
  createUserProfile(userId: string, profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/${userId}`, profile);
  }

  /**
   * Met à jour le profil utilisateur
   * @param id L'ID du profil utilisateur
   * @param profile Les données du profil à mettre à jour
   */
  updateUserProfile(id: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/${id}`, profile);
  }

  /**
   * Ajoute un genre aux favoris
   * @param profileId L'ID du profil utilisateur
   * @param genreId L'ID du genre
   * @param mediaType Le type de média (movie ou tv)
   */
  addFavoriteGenre(profileId: string, genreId: number, mediaType: 'movie' | 'tv'): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${profileId}/favorite-genres`, {
      genreId,
      mediaType
    });
  }

  /**
   * Supprime un genre des favoris
   * @param profileId L'ID du profil utilisateur
   * @param genreId L'ID du genre
   * @param mediaType Le type de média (movie ou tv)
   */
  removeFavoriteGenre(profileId: string, genreId: number, mediaType: 'movie' | 'tv'): Observable<{message: string}> {
    const params = new HttpParams().set('mediaType', mediaType);
    return this.http.delete<{message: string}>(`${this.apiUrl}/${profileId}/favorite-genres/${genreId}`, { params });
  }

  // === Méthodes pour les plateformes de streaming ===

  /**
   * Ajoute une plateforme de streaming
   * @param profileId L'ID du profil utilisateur
   * @param platform Le nom de la plateforme
   */
  addStreamingPlatform(profileId: string, platform: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${profileId}/streaming-platforms`, {
      platform
    });
  }

  /**
   * Supprime une plateforme de streaming
   * @param profileId L'ID du profil utilisateur
   * @param platform Le nom de la plateforme
   */
  removeStreamingPlatform(profileId: string, platform: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${profileId}/streaming-platforms/${platform}`);
  }
}
