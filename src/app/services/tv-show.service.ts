import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TvShow {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class TvShowService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) { }

  getRecentTvShows(): Observable<TvShow[]> {
    return this.http.get<TvShow[]>(`${this.apiUrl}/media/tv/recent`);
  }

  getTvShowDetail(id: string, lang: string = 'es-ES'): Observable<any> {
    return this.http.get(`${this.apiUrl}/media/tv/detail/${id}?lang=${lang}`);
  }
}
