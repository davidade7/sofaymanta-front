import { Routes } from '@angular/router';
import { RecentMoviesComponent } from './movies/recent-movies/recent-movies.component';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { RecentTvShowComponent } from './tv-show/recent-tv-show/recent-tv-show.component';
import { HomeComponent } from './home/home.component';  // Importez le HomeComponent

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Remplacez RecentMoviesComponent par HomeComponent ici
    { path: 'movies/recent', component: RecentMoviesComponent },
    { path: 'movies/detail/:id', component: MovieDetailComponent },
    { path: 'tv/recent', component: RecentTvShowComponent },
    { path: '**', redirectTo: '/' }
];
