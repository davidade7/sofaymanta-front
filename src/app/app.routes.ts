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
import { AdminComponent } from './admin/admin.component';
import { AuthGuard, AdminGuard, NonAdminGuard } from './guards/auth.gard';

export const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'search',
    component: SearchResultsComponent,
    canActivate: [NonAdminGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, NonAdminGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [NonAdminGuard],
  },
  {
    path: 'movie/detail/:id',
    component: MovieDetailComponent,
    canActivate: [NonAdminGuard],
  },
  {
    path: 'serie/detail/:id',
    component: TvShowDetailComponent,
    canActivate: [NonAdminGuard],
  },
  {
    path: 'tv/:showId/season/:seasonNumber',
    component: TvSeasonDetailComponent,
    canActivate: [NonAdminGuard],
  },
  {
    path: 'tv/:showId/season/:seasonNumber/episode/:episodeNumber',
    component: TvEpisodeDetailComponent,
    canActivate: [NonAdminGuard],
  },
  {
    path: 'person/detail/:id',
    component: PersonDetailComponent,
    canActivate: [NonAdminGuard],
  },
  { path: '**', redirectTo: '/' },
];
