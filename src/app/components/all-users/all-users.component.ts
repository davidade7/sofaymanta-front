import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../services/userProfile.service';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css',
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];
  loadingUsers = false;
  Trash2 = Trash2;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userProfileService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
        this.loadingUsers = false;
      },
    });
  }

  deleteUser(userId: string) {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.'
      )
    ) {
      this.userProfileService.deleteUserAccount(userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers();
          } else {
            alert(
              'Error al eliminar el usuario: ' +
                (response.message || 'Error desconocido')
            );
          }
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          alert('Error al eliminar el usuario');
        },
      });
    }
  }
}
