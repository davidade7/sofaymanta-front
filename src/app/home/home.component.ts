import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentMoviesComponent } from '../movies/recent-movies/recent-movies.component';
import { RecentTvShowComponent } from '../tv-show/recent-tv-show/recent-tv-show.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecentMoviesComponent, RecentTvShowComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
