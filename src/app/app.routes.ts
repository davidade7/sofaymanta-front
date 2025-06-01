import { Routes } from '@angular/router';
import { RecentMoviesComponent } from './movies/recent-movies/recent-movies.component';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { RecentTvShowComponent } from './tv-show/recent-tv-show/recent-tv-show.component';
import { TvShowDetailComponent } from './tv-show/tv-show-detail/tv-show-detail.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'movies/recent', component: RecentMoviesComponent },
    { path: 'movies/detail/:id', component: MovieDetailComponent },
    { path: 'tv/recent', component: RecentTvShowComponent },
    { path: 'tv/detail/:id', component: TvShowDetailComponent },
    { path: '**', redirectTo: '/' }
];
