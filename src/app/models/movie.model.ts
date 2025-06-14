export interface Movie {
  id: string | number;
  title: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  genre_ids?: number[];
  adult?: boolean;
  originalLanguage?: string;
  popularity?: number;
}

export interface MovieCard {
  id: string | number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  genre_ids?: number[];
  adult?: boolean;
}
