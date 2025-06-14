import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) {}

  searchMedia(query: string, page: number = 1): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<any[]>(`${this.apiUrl}/media/search`, { params })
      .pipe(
        map(results => this.processSearchResults(results))
      );
  }

  private processSearchResults(results: any[]) {
    // Séparer les résultats en films et séries
    const movies = results.filter(item => item.media_type === 'movie');
    const series = results.filter(item => item.media_type === 'tv');
    const persons = results.filter(item => item.media_type === 'person');

    return {
      movies,
      series,
      persons,
      totalMovies: movies.length,
      totalSeries: series.length,
      totalPersons: persons.length,
      total: results.length
    };
  }
}
