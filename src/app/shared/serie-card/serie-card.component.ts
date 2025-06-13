import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Tv } from 'lucide-angular';

@Component({
  selector: 'app-serie-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './serie-card.component.html',
  styleUrl: './serie-card.component.css'
})
export class SerieCardComponent {
  @Input() serie: any;
  @Output() cardClick = new EventEmitter<number>();
  Tv = Tv; // Pour utiliser l'icône dans le template

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
    this.cardClick.emit(this.serie.id);
  }
}
