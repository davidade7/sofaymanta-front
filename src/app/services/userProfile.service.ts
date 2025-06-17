import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  username: string;
  created_at: string | Date;
  updated_at: string | Date;
  // Ajoutez d'autres propriétés selon votre entité backend
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/user-profiles`;

  constructor(private http: HttpClient) {}

  /**
   * Crée un profil utilisateur pour un utilisateur spécifique
   * @param userId L'ID de l'utilisateur
   * @param profile Les données du profil à créer
   */
  createUserProfile(userId: string, profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/${userId}`, profile);
  }

  /**
   * Récupère le profil d'un utilisateur
   * @param id L'ID du profil utilisateur
   */
  getUserProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }
}
