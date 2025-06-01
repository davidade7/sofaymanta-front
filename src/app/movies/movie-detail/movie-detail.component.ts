// filepath: c:\Users\Usuario\Documents\David\Code\sofaymanta-frontend\src\app\movies\movie-detail\movie-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Star } from 'lucide-angular';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  // Icônes disponibles pour le template
  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;

  movie: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovie(id);
      }
    });
  }

  loadMovie(id: string): void {
    this.loading = true;
    this.movieService.getMovieDetail(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading movie details', err);
        this.error = 'Error al cargar los detalles del film';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
