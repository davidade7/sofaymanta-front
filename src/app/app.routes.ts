import { Routes } from '@angular/router';
import { RecentMoviesComponent } from './movies/recent-movies/recent-movies.component';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { RecentTvShowComponent } from './tv-show/recent-tv-show/recent-tv-show.component';

export const routes: Routes = [
    { path: '', component: RecentMoviesComponent },
    { path: 'movies/recent', component: RecentMoviesComponent },
    { path: 'movies/detail/:id', component: MovieDetailComponent },
    { path: 'tv/recent', component: RecentTvShowComponent },
    { path: '**', redirectTo: '/' }
];
