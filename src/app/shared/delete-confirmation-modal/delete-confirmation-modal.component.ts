import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Trash2, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css'
})
export class DeleteConfirmationModalComponent {
  @Input() message: string = '¿Estás seguro de que quieres eliminar este elemento?';
  @Input() isDeleting: boolean = false;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  readonly X = X;
  readonly Trash2 = Trash2;
  readonly AlertTriangle = AlertTriangle;

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  confirm() {
    this.confirmDelete.emit();
  }

  cancel() {
    this.cancelDelete.emit();
  }
}
