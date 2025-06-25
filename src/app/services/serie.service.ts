import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SerieCard } from '../models/serie.model';

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
  providedIn: 'root',
})
export class SerieService {
  private apiUrl = 'https://sofaymanta-back-production.up.railway.app';

  constructor(private http: HttpClient) {}

  getRecentTvShows(): Observable<SerieCard[]> {
    return this.http.get<SerieCard[]>(`${this.apiUrl}/media/tv/recent`);
  }

  getPopularTvShows(): Observable<SerieCard[]> {
    return this.http.get<SerieCard[]>(`${this.apiUrl}/media/tv/popular`);
  }

  getTvShowDetail(id: string, lang: string = 'es-ES'): Observable<any> {
    return this.http.get(`${this.apiUrl}/media/tv/detail/${id}?lang=${lang}`);
  }

  getTvShowSeasonDetail(
    id: string,
    season: number,
    lang: string = 'es-ES'
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/media/tv/${id}/season/${season}?lang=${lang}`
    );
  }

  getTvShowEpisodeDetail(
    id: string,
    season: number,
    episode: number,
    lang: string = 'es-ES'
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/media/tv/${id}/season/${season}/episode/${episode}?lang=${lang}`
    );
  }

  getTvShowEpisodesCredits(
    id: string,
    season: number,
    episode: number,
    lang: string = 'es-ES'
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/media/tv/${id}/season/${season}/episode/${episode}/credits?lang=${lang}`
    );
  }
}
