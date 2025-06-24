import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/userProfile.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Loader2, Trash2 } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, CommonModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
})
export class DeleteAccountComponent {
  @Input() profileId!: string;
  @Output() cancelled = new EventEmitter<void>();

  Loader2 = Loader2;
  Trash2 = Trash2;

  confirmationText = '';
  isDeleting = false;
  errorMessage = '';

  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  isConfirmationValid(): boolean {
    return this.confirmationText.trim().toUpperCase() === 'ELIMINAR';
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onDeleteAccount(): void {
    if (!this.isConfirmationValid() || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.userProfileService.deleteUserAccount(this.profileId).subscribe({
      next: (response) => {
        if (response.success) {
          // Desconectar al usuario
          this.authService.signOut();
          // Redirigir a la página de inicio
          this.router.navigate(['/']);
          // Opcional: mostrar un mensaje de confirmación
          alert('Tu cuenta ha sido eliminada con éxito.');
        } else {
          this.errorMessage = response.message || 'Error al eliminar la cuenta';
        }
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.errorMessage = 'Ha ocurrido un error al eliminar la cuenta';
        this.isDeleting = false;
      },
    });
  }
}
