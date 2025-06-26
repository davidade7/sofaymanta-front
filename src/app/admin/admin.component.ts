import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserProfileService } from '../services/userProfile.service';
import { UserMediaInteractionsService } from '../services/userMediaInteractions.service';
import { StreamingPlatformService } from '../services/streamingPlatform.service';
import { StreamingPlatform } from '../models/streaming-platform.model';
import {
  LucideAngularModule,
  Pencil,
  Trash2,
  Plus,
  X,
  Power,
} from 'lucide-angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  isLoading = true;
  currentUser: any = null;
  showStreamingPlatforms = false;
  showStatistics = false;
  showUsers = false;
  showRatings = false;
  streamingPlatforms: any[] = [];
  users: any[] = [];
  ratings: any[] = [];
  isCreating = false;
  newPlatform: any = {
    code: '',
    name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
  };
  selectedPlatform: any = null;

  // Estadísticas
  totalUsers = 0;
  totalRatings = 0;
  loadingStats = false;
  loadingUsers = false;
  loadingRatings = false;

  // Iconos Lucide
  Pencil = Pencil;
  Trash2 = Trash2;
  Plus = Plus;
  X = X;
  Power = Power;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private streamingPlatformService: StreamingPlatformService,
    private userMediaInteractionsService: UserMediaInteractionsService
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      const { data: authData, error: authError } =
        await this.authService.getUserWithMetadata();

      if (authError || !authData?.data?.user) {
        console.error('Error al cargar el usuario:', authError);
        return;
      }

      const userId = authData.data.user.id;

      // Obtener el perfil del usuario usando UserProfileService
      this.userProfileService.getUserProfile(userId).subscribe(
        (profile) => {
          this.currentUser = profile;
        },
        (error) => {
          console.error('Error al cargar el perfil del usuario:', error);
        }
      );
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loadStatistics() {
    this.loadingStats = true;

    // Cargar todos los usuarios y contar su número
    this.userProfileService.getAllUsers().subscribe(
      (users) => {
        this.totalUsers = users.length;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );

    // Cargar el número de evaluaciones vía getAllRatings
    this.loadingStats = true;
    this.userMediaInteractionsService.getAllRatings().subscribe(
      (ratings) => {
        this.totalRatings = ratings.length;
        this.loadingStats = false;
      },
      (error) => {
        console.error('Error al cargar las evaluaciones:', error);
        this.loadingStats = false;
      }
    );
  }

  toggleStreamingPlatforms() {
    this.showStreamingPlatforms = !this.showStreamingPlatforms;
    if (this.showStreamingPlatforms) {
      this.loadStreamingPlatforms();
    }
  }

  toggleStatistics() {
    this.showStatistics = !this.showStatistics;
    if (
      this.showStatistics &&
      !this.loadingStats &&
      this.totalUsers === 0 &&
      this.totalRatings === 0
    ) {
      this.loadStatistics();
    }
  }

  toggleUsers() {
    this.showUsers = !this.showUsers;
    if (this.showUsers && this.users.length === 0) {
      this.loadUsers();
    }
  }

  toggleRatings() {
    this.showRatings = !this.showRatings;
    if (this.showRatings && this.ratings.length === 0) {
      this.loadRatings();
    }
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userProfileService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
        this.loadingUsers = false;
      }
    );
  }

  loadRatings() {
    this.loadingRatings = true;
    this.userMediaInteractionsService.getAllRatings().subscribe(
      (ratings) => {
        this.ratings = ratings;
        this.loadingRatings = false;
      },
      (error) => {
        console.error('Error al cargar las evaluaciones:', error);
        this.loadingRatings = false;
      }
    );
  }

  deleteUser(userId: string) {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.'
      )
    ) {
      this.userProfileService.deleteUserAccount(userId).subscribe(
        (response) => {
          if (response.success) {
            console.log('Usuario eliminado exitosamente');
            this.loadUsers(); // Recargar la lista
          } else {
            console.error('Error eliminando usuario:', response.error);
            alert(
              'Error al eliminar el usuario: ' +
                (response.message || 'Error desconocido')
            );
          }
        },
        (error) => {
          console.error('Error eliminando usuario:', error);
          alert('Error al eliminar el usuario');
        }
      );
    }
  }

  loadStreamingPlatforms() {
    this.streamingPlatformService.findAll().subscribe(
      (platforms) => {
        this.streamingPlatforms = platforms;
      },
      (error) => {
        console.error('Error al cargar las plataformas de streaming:', error);
      }
    );
  }

  createPlatform() {
    this.streamingPlatformService.create(this.newPlatform).subscribe(
      () => {
        this.loadStreamingPlatforms();
        this.newPlatform = {
          code: '',
          name: '',
          logo_url: '',
          website_url: '',
          is_active: true,
        }; // Reiniciar formulario
        this.isCreating = false;
      },
      (error) => {
        console.error('Error al crear la plataforma:', error);
      }
    );
  }

  openEditForm(platform: StreamingPlatform) {
    this.selectedPlatform = { ...platform };
  }

  updatePlatform() {
    if (this.selectedPlatform) {
      this.streamingPlatformService
        .update(this.selectedPlatform.id, this.selectedPlatform)
        .subscribe(
          () => {
            this.loadStreamingPlatforms();
            this.selectedPlatform = null;
          },
          (error) => {
            console.error('Error al actualizar la plataforma:', error);
          }
        );
    }
  }

  togglePlatformStatus(platform: any) {
    const updatedPlatform = { ...platform, is_active: !platform.is_active };
    this.streamingPlatformService
      .update(platform.id, updatedPlatform)
      .subscribe(
        () => {
          this.loadStreamingPlatforms();
        },
        (error) => {
          console.error(
            'Error al actualizar el estado de la plataforma:',
            error
          );
        }
      );
  }

  closeEditForm() {
    this.selectedPlatform = null;
  }

  deletePlatform(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta plataforma?')) {
      this.streamingPlatformService.remove(id).subscribe(
        () => {
          this.loadStreamingPlatforms();
        },
        (error) => {
          console.error('Error al eliminar la plataforma:', error);
        }
      );
    }
  }

  deleteRating(ratingId: string, userId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      this.userMediaInteractionsService
        .deleteInteraction(ratingId, userId)
        .subscribe(
          () => {
            this.loadRatings();
            this.loadStatistics(); // Actualizar el contador
          },
          (error) => {
            console.error('Error al eliminar la evaluación:', error);
            alert('Error al eliminar la evaluación');
          }
        );
    }
  }
}
