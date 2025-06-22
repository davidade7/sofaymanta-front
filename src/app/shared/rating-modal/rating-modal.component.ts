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
  @Input() mediaType!: 'movie' | 'tv';
  @Input() mediaTitle!: string;
  @Input() seasonNumber?: number;
  @Input() episodeNumber?: number;
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

  isValid(): boolean {
    const hasContent = this.currentRating > 0 || this.currentComment.trim().length > 0;

    // Si c'est une série avec des numéros de saison/épisode, les vérifier
    if (this.mediaType === 'tv' && this.seasonNumber !== undefined && this.episodeNumber !== undefined) {
      return hasContent && this.seasonNumber > 0 && this.episodeNumber > 0;
    }

    return hasContent;
  }

  saveInteraction() {
    if (!this.isValid()) return;

    this.isLoading = true;
    this.errorMessage = '';

    const interactionData: CreateUserMediaInteractionDto = {
      media_id: this.mediaId,
      media_type: this.mediaType,
      rating: this.currentRating || undefined,
      comment: this.currentComment.trim() || undefined,
    };

    if (this.seasonNumber !== undefined) {
      interactionData.season_number = this.seasonNumber;
    }
    if (this.episodeNumber !== undefined) {
      interactionData.episode_number = this.episodeNumber;
    }

    if (this.existingInteraction) {
      // Mise à jour
      this.userMediaInteractionsService.updateInteraction(
        this.existingInteraction.id,
        this.userId,
        {
          rating: this.currentRating || undefined,
          comment: this.currentComment.trim() || undefined
        }
      ).subscribe({
        next: (interaction) => {
          this.interactionSaved.emit(interaction);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating interaction:', error);
          this.errorMessage = 'Error al actualizar la evaluación. Intenta de nuevo.';
          this.isLoading = false;
        }
      });
    } else {
      // Création
      this.userMediaInteractionsService.createInteraction(this.userId, interactionData).subscribe({
        next: (interaction) => {
          this.interactionSaved.emit(interaction);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating interaction:', error);
          this.errorMessage = 'Error al guardar la evaluación. Intenta de nuevo.';
          this.isLoading = false;
        }
      });
    }
  }
}
