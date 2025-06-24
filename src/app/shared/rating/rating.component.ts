import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Star,
  MessageSquare,
  Trash2,
} from 'lucide-angular';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import {
  UserMediaInteraction,
  UserMediaInteractionsService,
} from '../../services/userMediaInteractions.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RatingModalComponent,
    DeleteConfirmationModalComponent,
  ],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  // Icônes à utiliser dans le template
  readonly Star = Star;
  readonly MessageSquare = MessageSquare;
  readonly Trash2 = Trash2;

  // Inputs pour recevoir les données du parent
  @Input() mediaId!: number;
  @Input() mediaType: 'movie' | 'tv' = 'movie'; // Uniquement movie ou tv comme demandé
  @Input() mediaTitle: string = '';
  @Input() currentUser: any = null;
  @Input() seasonNumber?: number; // Optionnel - pour les épisodes
  @Input() episodeNumber?: number; // Optionnel - pour les épisodes

  // État local
  userInteraction: UserMediaInteraction | null = null;
  showRatingModal = false;
  showDeleteModal = false;
  isDeleting = false;

  constructor(
    private userMediaInteractionsService: UserMediaInteractionsService
  ) {}

  ngOnInit() {
    if (this.currentUser) {
      this.loadUserInteraction();
    }
  }

  // Charge l'interaction utilisateur (évaluation) pour le média actuel
  loadUserInteraction() {
    if (!this.currentUser || !this.mediaId) return;

    this.userMediaInteractionsService
      .getUserMediaInteraction(
        this.currentUser.id,
        this.mediaId,
        this.mediaType,
        this.seasonNumber,
        this.episodeNumber
      )
      .subscribe({
        next: (interaction) => {
          this.userInteraction = interaction;
        },
        error: () => {
          this.userInteraction = null;
        },
      });
  }

  // Actions utilisateur
  openRatingModal() {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para evaluar este contenido');
      return;
    }
    this.showRatingModal = true;
  }

  closeRatingModal() {
    this.showRatingModal = false;
  }

  onInteractionSaved(interaction: UserMediaInteraction) {
    this.userInteraction = interaction;
    this.showRatingModal = false;
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDeleteInteraction() {
    if (!this.userInteraction || !this.currentUser) return;

    this.isDeleting = true;

    this.userMediaInteractionsService
      .deleteInteraction(this.userInteraction.id, this.currentUser.id)
      .subscribe({
        next: () => {
          this.userInteraction = null;
          this.isDeleting = false;
          this.showDeleteModal = false;
        },
        error: (error) => {
          this.isDeleting = false;
          console.error('Error deleting interaction:', error);
          alert('Error al eliminar la evaluación. Intenta de nuevo.');
        },
      });
  }

  // Méthode utilitaire pour adapter le texte selon le type de média
  getContentTypeText(): string {
    if (this.mediaType === 'movie') return 'película';
    if (this.mediaType === 'tv') {
      if (this.seasonNumber !== undefined && this.episodeNumber !== undefined) {
        return 'episodio';
      }
      return 'serie';
    }
    return 'contenido';
  }
}
