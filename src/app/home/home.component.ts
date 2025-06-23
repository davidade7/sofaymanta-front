import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SearchInputComponent } from '../shared/search-input/search-input.component';
import { CarouselComponent } from '../shared/carousel/carousel.component';
import { MovieCardComponent } from '../shared/movie-card/movie-card.component';
import { SerieCardComponent } from '../shared/serie-card/serie-card.component';
import { TopButtonComponent } from '../shared/top-button/top-button.component';
import { MovieService } from '../services/movie.service';
import { SerieService } from '../services/serie.service';
import { MovieCard } from '../models/movie.model';
import { SerieCard } from '../models/serie.model';
import { LucideAngularModule, TrendingUp, Star, MessageSquare, Heart } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent, CarouselComponent, MovieCardComponent, SerieCardComponent, TopButtonComponent, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  recentMovies: MovieCard[] = [];
  popularMovies: MovieCard[] = [];
  recentSeries: SerieCard[] = [];
  popularSeries: SerieCard[] = [];

  readonly TrendingUp = TrendingUp;
  readonly Star = Star;
  readonly MessageSquare = MessageSquare;
  readonly Heart = Heart;

  loading = {
    recentMovies: false,
    popularMovies: false,
    recentSeries: false,
    popularSeries: false
  };

  constructor(
    private authService: AuthService,
    private movieService: MovieService,
    private serieService: SerieService
  ) { }

  async ngOnInit() {
    await this.loadCurrentUser();
    this.loadRecentMovies();
    this.loadPopularMovies();
    this.loadRecentSeries();
    this.loadPopularSeries();
  }

  async loadCurrentUser() {
    try {
      const { data, error } = await this.authService.getUserWithMetadata();

      if (error) {
        console.error('Error getting user:', error);
        this.currentUser = null;
        return;
      }

      this.currentUser = data?.user || null;
    } catch (error) {
      console.error('Error in loadCurrentUser:', error);
      this.currentUser = null;
    }
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

  loadRecentSeries() {
    this.loading.recentSeries = true;
    this.serieService.getRecentTvShows().subscribe({
      next: (data) => {
        this.recentSeries = data;
        this.loading.recentSeries = false;
      },
      error: (error) => {
        console.error('Error fetching recent series:', error);
        this.loading.recentSeries = false;
      }
    });
  }

  loadPopularSeries() {
    this.loading.popularSeries = true;
    this.serieService.getPopularTvShows().subscribe({
      next: (data) => {
        this.popularSeries = data;
        this.loading.popularSeries = false;
      },
      error: (error) => {
        console.error('Error fetching popular series:', error);
        this.loading.popularSeries = false;
      }
    });
  }
}
