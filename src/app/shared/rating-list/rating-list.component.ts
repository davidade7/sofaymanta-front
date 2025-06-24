import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star } from 'lucide-angular';
import { UserMediaInteraction } from '../../services/userMediaInteractions.service';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css'],
})
export class RatingListComponent {
  // Icône à utiliser
  readonly Star = Star;

  // Entrées
  @Input() allRatings: UserMediaInteraction[] = [];
  @Input() loadingRatings = false;
  @Input() mediaType: 'movie' | 'tv' = 'movie';

  // État local
  showAllRatings = false;

  // Getters utiles
  get totalRatings(): number {
    return this.allRatings.length;
  }

  get averageRating(): number {
    if (this.allRatings.length === 0) return 0;
    const sum = this.allRatings.reduce(
      (acc, rating) => acc + (rating.rating || 0),
      0
    );
    return Math.round((sum / this.allRatings.length) * 10) / 10;
  }

  // Actions
  toggleShowAllRatings(): void {
    this.showAllRatings = !this.showAllRatings;
  }

  getContentTypeText(): string {
    return this.mediaType === 'movie' ? 'película' : 'serie';
  }
}
