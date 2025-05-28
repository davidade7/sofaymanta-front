import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) { }

  getRecentMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/recent`);
  }
}
