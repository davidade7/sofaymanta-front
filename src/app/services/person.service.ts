import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) { }

  /**
   * Gets person details by ID
   * @param personId The ID of the person to retrieve
   * @param lang The language code (default 'es-ES')
   * @returns Observable with the person details
   */
  getPerson(personId: number, lang: string = 'es-ES'): Observable<any> {
    const params = new HttpParams().set('lang', lang);

    return this.http.get<any>(`${this.apiUrl}/media/person/${personId}`, { params });
  }

  /**
   * Gets the credits of a person by their ID
   * @param personId The ID of the person whose credits to retrieve
   * @param lang The language code (default 'es-ES')
   * @returns Observable with the person's credits
   */
  getPersonCredits(personId: number, lang: string = 'es-ES'): Observable<any> {
    const params = new HttpParams().set('lang', lang);

    return this.http.get<any>(`${this.apiUrl}/media/person/${personId}/combinedCredits`, { params });
  }
}

