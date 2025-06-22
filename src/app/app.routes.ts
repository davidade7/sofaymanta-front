import { Routes } from '@angular/router';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { TvShowDetailComponent } from './tv-show/tv-show-detail/tv-show-detail.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TvSeasonDetailComponent } from './tv-show/tv-season-detail/tv-season-detail.component';
import { TvEpisodeDetailComponent } from './tv-show/tv-episode-detail/tv-episode-detail.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { PersonDetailComponent } from './person/person-detail/person-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './admin/admin.component'; // Attention au chemin
import { AuthGuard, AdminGuard } from './guards/auth.gard';

export const routes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'search', component: SearchResultsComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: '', component: HomeComponent },
    { path: 'movie/detail/:id', component: MovieDetailComponent },
    { path: 'serie/detail/:id', component: TvShowDetailComponent },
    { path: 'tv/:showId/season/:seasonNumber', component: TvSeasonDetailComponent },
    { path: 'tv/:showId/season/:seasonNumber/episode/:episodeNumber', component: TvEpisodeDetailComponent },
    { path: 'person/detail/:id', component: PersonDetailComponent },
    { path: '**', redirectTo: '/' }
];
