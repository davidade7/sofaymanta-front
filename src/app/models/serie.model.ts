export interface SerieCard {
  id: string | number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  genre_ids?: number[];
  adult?: boolean;
}
