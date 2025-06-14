import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieCard } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) { }

  getRecentMovies(): Observable<MovieCard[]> {
    return this.http.get<MovieCard[]>(`${this.apiUrl}/media/movies/recent`);
  }

  getPopularMovies(): Observable<MovieCard[]> {
    return this.http.get<MovieCard[]>(`${this.apiUrl}/media/movies/popular`);
  }

  getMovieDetail(id: string, lang: string = 'es-ES'): Observable<any> {
    return this.http.get(`${this.apiUrl}/media/movies/detail/${id}?lang=${lang}`);
  }
}
