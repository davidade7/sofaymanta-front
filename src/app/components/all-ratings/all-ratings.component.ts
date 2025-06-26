import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMediaInteractionsService } from '../../services/userMediaInteractions.service';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-all-ratings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './all-ratings.component.html',
  styleUrl: './all-ratings.component.css',
})
export class AllRatingsComponent implements OnInit {
  ratings: any[] = [];
  loadingRatings = false;
  Trash2 = Trash2;

  constructor(
    private userMediaInteractionsService: UserMediaInteractionsService
  ) {}

  ngOnInit() {
    this.loadRatings();
  }

  loadRatings() {
    this.loadingRatings = true;
    this.userMediaInteractionsService.getAllRatings().subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.loadingRatings = false;
      },
      error: (error) => {
        console.error('Error al cargar las evaluaciones:', error);
        this.loadingRatings = false;
      },
    });
  }

  deleteRating(ratingId: string, userId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      this.userMediaInteractionsService
        .deleteInteraction(ratingId, userId)
        .subscribe({
          next: () => {
            this.loadRatings();
          },
          error: (error) => {
            console.error('Error al eliminar la evaluación:', error);
            alert('Error al eliminar la evaluación');
          },
        });
    }
  }
}
