import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) { }

  /**
   * Search for multimedia based on the provided query and language
   * @param query The search query
   * @param lang The language code (defaults to 'es-ES')
   * @returns Observable of the search results
   */
  searchMultimedia(query: string, lang: string = 'es-ES'): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('lang', lang);

    return this.http.get<any>(`${this.apiUrl}/media/search`, { params });
  }
}
