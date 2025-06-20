import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Star, MessageCircle } from 'lucide-angular';
import { UserMediaInteractionsService, CreateUserMediaInteractionDto, UpdateUserMediaInteractionDto, UserMediaInteraction } from '../../services/userMediaInteractions.service';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent implements OnInit {
  @Input() mediaId!: number;
  @Input() mediaType: 'movie' | 'tv' = 'movie';
  @Input() mediaTitle!: string;
  @Input() userId!: string;
  @Input() existingInteraction: UserMediaInteraction | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() interactionSaved = new EventEmitter<UserMediaInteraction>();

  readonly X = X;
  readonly Star = Star;
  readonly MessageCircle = MessageCircle;

  currentRating = 0;
  hoverRating = 0;
  currentComment = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private userMediaInteractionsService: UserMediaInteractionsService
  ) {}

  ngOnInit() {
    if (this.existingInteraction) {
      this.currentRating = this.existingInteraction.rating || 0;
      this.currentComment = this.existingInteraction.comment || '';
    }
  }

  setRating(rating: number) {
    this.currentRating = rating;
  }

  getRatingDescription(rating: number): string {
    const descriptions = [
      '',
      'Terrible',
      'Muy malo',
      'Malo',
      'Regular',
      'Aceptable',
      'Bueno',
      'Muy bueno',
      'Excelente',
      'Obra maestra',
      'Perfecto'
    ];
    return descriptions[rating] || '';
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  saveInteraction() {
    if (this.currentRating === 0 && this.currentComment.trim() === '') {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Si on a une interaction existante, on fait toujours un UPDATE
    if (this.existingInteraction) {
      const updates: UpdateUserMediaInteractionDto = {};

      if (this.currentRating > 0) {
        updates.rating = this.currentRating;
      }

      if (this.currentComment.trim()) {
        updates.comment = this.currentComment.trim();
      }

      this.userMediaInteractionsService.updateInteraction(
        this.existingInteraction.id,
        this.userId,
        updates
      ).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.interactionSaved.emit(result);
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar tu evaluación. Intenta de nuevo.';
          console.error('Error updating interaction:', error);
        }
      });
    } else {
      // Si on n'a pas d'interaction existante, on crée une nouvelle
      const interaction: CreateUserMediaInteractionDto = {
        media_id: this.mediaId,
        media_type: this.mediaType
      };

      if (this.currentRating > 0) {
        interaction.rating = this.currentRating;
      }

      if (this.currentComment.trim()) {
        interaction.comment = this.currentComment.trim();
      }

      this.userMediaInteractionsService.createInteraction(this.userId, interaction).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.interactionSaved.emit(result);
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          // Si on a une erreur 409, cela signifie qu'une interaction a été créée entre temps
          if (error.status === 409) {
            this.errorMessage = 'Une évaluation existe déjà pour ce contenu. Veuillez recharger la page.';
          } else {
            this.errorMessage = 'Error al guardar tu evaluación. Intenta de nuevo.';
          }
          console.error('Error creating interaction:', error);
        }
      });
    }
  }
}
