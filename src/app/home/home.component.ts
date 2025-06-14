import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentMoviesComponent } from '../movies/recent-movies/recent-movies.component';
import { PopularMoviesComponent } from '../movies/popular-movies/popular-movies.component';
import { RecentTvShowComponent } from '../tv-show/recent-tv-show/recent-tv-show.component';
import { TvShowPopularComponent } from '../tv-show/tv-show-popular/tv-show-popular.component';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { CarouselComponent } from '../shared/carousel/carousel.component';
import { MovieCardComponent } from '../shared/movie-card/movie-card.component';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, RecentMoviesComponent, PopularMoviesComponent, RecentTvShowComponent, TvShowPopularComponent, CarouselComponent, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  recentMovies: Movie[] = [];
  popularMovies: Movie[] = [];

  loading = {
    recentMovies: false,
    popularMovies: false,
    recentSeries: false,
    popularSeries: false
  };

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.loadRecentMovies();
    this.loadPopularMovies();
  }

  loadRecentMovies() {
    this.loading.recentMovies = true;
    this.movieService.getRecentMovies().subscribe({
      next: (data) => {
        this.recentMovies = data;
        this.loading.recentMovies = false;
      },
      error: (error) => {
        console.error('Error fetching recent movies:', error);
        this.loading.recentMovies = false;
      }
    });
  }

  loadPopularMovies() {
    this.loading.popularMovies = true;
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies = data;
        this.loading.popularMovies = false;
      },
      error: (error) => {
        console.error('Error fetching popular movies:', error);
        this.loading.popularMovies = false;
      }
    });
  }
}
