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
  runtime?: number;
  genres?: Genre[];
  adult?: boolean;
  originalLanguage?: string;
  popularity?: number;
}

export interface Genre {
  id: number;
  name: string;
}
