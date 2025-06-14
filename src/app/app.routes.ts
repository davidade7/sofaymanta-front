import { Routes } from '@angular/router';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { TvShowDetailComponent } from './tv-show/tv-show-detail/tv-show-detail.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TvSeasonDetailComponent } from './tv-show/tv-season-detail/tv-season-detail.component';
import { SearchResultComponent } from './pages/search-results/search-results.component';
import { PersonDetailComponent } from './person/person-detail/person-detail.component';

export const routes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'search', component: SearchResultComponent },
    { path: '', component: HomeComponent },
    { path: 'movie/detail/:id', component: MovieDetailComponent },
    { path: 'tv/detail/:id', component: TvShowDetailComponent },
    { path: 'tv/:showId/season/:seasonNumber', component: TvSeasonDetailComponent },
    { path: 'person/detail/:id', component: PersonDetailComponent },
    { path: '**', redirectTo: '/' }
];
