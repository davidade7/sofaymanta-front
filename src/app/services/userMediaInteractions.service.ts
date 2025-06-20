import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces pour typer les données
export interface CreateUserMediaInteractionDto {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  rating?: number; // Note de 1 à 10
  comment?: string;
}

export interface UpdateUserMediaInteractionDto {
  rating?: number;
  comment?: string;
}

export interface UserMediaInteraction {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  rating?: number;
  comment?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class UserMediaInteractionsService {
  private apiUrl = `${environment.apiUrl}/user-media-interactions`;

  constructor(private http: HttpClient) {}

  /**
   * Crée une nouvelle interaction média pour un utilisateur
   * @param userId L'ID de l'utilisateur
   * @param interaction Les données de l'interaction à créer
   */
  createInteraction(userId: string, interaction: CreateUserMediaInteractionDto): Observable<UserMediaInteraction> {
    return this.http.post<UserMediaInteraction>(`${this.apiUrl}/${userId}`, interaction);
  }

  /**
   * Récupère toutes les interactions d'un utilisateur
   * @param userId L'ID de l'utilisateur
   */
  getUserInteractions(userId: string): Observable<UserMediaInteraction[]> {
    return this.http.get<UserMediaInteraction[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Récupère l'interaction d'un utilisateur pour un média spécifique
   * @param userId L'ID de l'utilisateur
   * @param mediaId L'ID du média
   * @param mediaType Le type de média (movie ou tv)
   */
  getUserMediaInteraction(userId: string, mediaId: number, mediaType: 'movie' | 'tv'): Observable<UserMediaInteraction> {
    const params = new HttpParams().set('mediaType', mediaType);
    return this.http.get<UserMediaInteraction>(`${this.apiUrl}/user/${userId}/media/${mediaId}`, { params });
  }

  /**
   * Récupère une interaction spécifique par son ID
   * @param interactionId L'ID de l'interaction
   */
  getInteractionById(interactionId: string): Observable<UserMediaInteraction> {
    return this.http.get<UserMediaInteraction>(`${this.apiUrl}/${interactionId}`);
  }

  /**
   * Met à jour une interaction existante
   * @param interactionId L'ID de l'interaction
   * @param userId L'ID de l'utilisateur (pour vérification)
   * @param updates Les données à mettre à jour
   */
  updateInteraction(interactionId: string, userId: string, updates: UpdateUserMediaInteractionDto): Observable<UserMediaInteraction> {
    return this.http.patch<UserMediaInteraction>(`${this.apiUrl}/${interactionId}/user/${userId}`, updates);
  }

  /**
   * Supprime une interaction
   * @param interactionId L'ID de l'interaction
   * @param userId L'ID de l'utilisateur (pour vérification)
   */
  deleteInteraction(interactionId: string, userId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${interactionId}/user/${userId}`);
  }
}
