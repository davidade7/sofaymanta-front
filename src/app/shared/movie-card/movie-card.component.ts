import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Film } from 'lucide-angular';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movie: any;
  @Output() cardClick = new EventEmitter<number>();
  Film = Film; // Pour utiliser l'icône dans le template

  getImageUrl(path: string): string {
    if (!path) return 'https://placehold.co/500x750?text=Imagen+no+disponible&font=open-sans';
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  truncateOverview(overview: string): string {
    if (!overview) return '';
    return overview.length > 150 ? overview.substring(0, 150) + '...' : overview;
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  onClick(): void {
    this.cardClick.emit(this.movie.id);
  }
}
