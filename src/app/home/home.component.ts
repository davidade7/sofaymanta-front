import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentMoviesComponent } from '../movies/recent-movies/recent-movies.component';
import { PopularMoviesComponent } from '../movies/popular-movies/popular-movies.component';
import { RecentTvShowComponent } from '../tv-show/recent-tv-show/recent-tv-show.component';
import { TvShowPopularComponent } from '../tv-show/tv-show-popular/tv-show-popular.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecentMoviesComponent, PopularMoviesComponent, RecentTvShowComponent, TvShowPopularComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
