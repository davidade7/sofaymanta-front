import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvShowService } from '../../services/tv-show.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-tv-season-detail',
  imports: [CommonModule],
  templateUrl: './tv-season-detail.component.html',
  styleUrls: ['./tv-season-detail.component.css']
})
export class TvSeasonDetailComponent implements OnInit {
  seasonDetail: any;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tvShowService: TvShowService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const showId = params['showId'];
      const seasonNumber = params['seasonNumber'];

      if (showId && seasonNumber) {
        this.loadSeasonDetail(showId, parseInt(seasonNumber));
      }
    });
  }

  loadSeasonDetail(showId: string, seasonNumber: number): void {
    this.loading = true;
    this.tvShowService.getTvShowSeasonDetail(showId, seasonNumber).subscribe({
      next: (data) => {
        this.seasonDetail = data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error)
        this.error = 'Error al cargar los detalles de la temporada';
        this.loading = false;
      }
    });
  }

  getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster+Available';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getStillImageUrl(path: string | null | undefined): string {
    if (!path) return 'https://placehold.co/500x280?text=No+Image+Available';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  goBack(): void {
    this.location.back();
  }
}
