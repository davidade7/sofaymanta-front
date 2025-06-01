import { Routes } from '@angular/router';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';

export const routes: Routes = [
    { path: 'movies/detail/:id', component: MovieDetailComponent },
];
