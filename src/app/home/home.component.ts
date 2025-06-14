import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentTvShowComponent } from '../tv-show/recent-tv-show/recent-tv-show.component';
import { TvShowPopularComponent } from '../tv-show/tv-show-popular/tv-show-popular.component';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { CarouselComponent } from '../shared/carousel/carousel.component';
import { MovieCardComponent } from '../shared/movie-card/movie-card.component';
import { MovieService } from '../services/movie.service';
import { MovieCard } from '../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, RecentTvShowComponent, TvShowPopularComponent, CarouselComponent, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recentMovies: MovieCard[] = [];
  popularMovies: MovieCard[] = [];

  loading = {
    recentMovies: false,
    popularMovies: false,
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
        console.log('Recent Movies:', data);
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
