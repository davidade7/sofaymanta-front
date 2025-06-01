import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../services/tv-show.service';

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

interface TvShowDetail {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  tagline: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  episode_run_time: number[];
  number_of_seasons: number;
  seasons: Season[];
  created_by: Creator[];
  networks: Network[];
  status: string;
  next_episode_to_air?: {
    air_date: string;
    episode_number: number;
    name: string;
  };
  genres: {
    id: number;
    name: string;
  }[];
}

@Component({
  selector: 'app-tv-show-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.css']
})
export class TvShowDetailComponent implements OnInit {
  tvShow?: TvShowDetail;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: TvShowService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadTvShowDetails(id);
      } else {
        this.error = 'ID de série TV invalide';
        this.loading = false;
      }
    });
  }

  loadTvShowDetails(id: string): void {
    this.tvShowService.getTvShowDetail(id).subscribe({
      next: (data) => {
        this.tvShow = data as TvShowDetail;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des détails de la série TV';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'assets/images/no-poster.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getYear(date: string): string {
    return date ? new Date(date).getFullYear().toString() : 'N/A';
  }

  formatRuntime(minutes: number[]): string {
    if (!minutes || minutes.length === 0) return 'N/A';

    const runtime = minutes[0];
    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
