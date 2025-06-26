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

  // Statistiques
  totalUsers = 0;
  totalRatings = 0;
  loadingStats = false;
  loadingUsers = false;
  loadingRatings = false;

  // Icônes Lucide
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
        console.error('Error loading user:', authError);
        return;
      }

      const userId = authData.data.user.id;

      // Fetch the user profile using the UserProfileService
      this.userProfileService.getUserProfile(userId).subscribe(
        (profile) => {
          this.currentUser = profile;
        },
        (error) => {
          console.error('Error loading user profile:', error);
        }
      );
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loadStatistics() {
    this.loadingStats = true;

    // Charger tous les utilisateurs et compter leur nombre
    this.userProfileService.getAllUsers().subscribe(
      (users) => {
        this.totalUsers = users.length;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );

    // Charger le nombre d'évaluations via getAllRatings
    this.loadingStats = true;
    this.userMediaInteractionsService.getAllRatings().subscribe(
      (ratings) => {
        this.totalRatings = ratings.length;
        this.loadingStats = false;
      },
      (error) => {
        console.error('Error loading ratings:', error);
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
        console.error('Error loading users:', error);
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
        console.error('Error loading ratings:', error);
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
        console.error('Error loading streaming platforms:', error);
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
        }; // Reset form
        this.isCreating = false;
      },
      (error) => {
        console.error('Error creating platform:', error);
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
            console.error('Error updating platform:', error);
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
          console.error('Error updating platform status:', error);
        }
      );
  }

  closeEditForm() {
    this.selectedPlatform = null;
  }

  deletePlatform(id: string) {
    if (confirm('Are you sure you want to delete this platform?')) {
      this.streamingPlatformService.remove(id).subscribe(
        () => {
          this.loadStreamingPlatforms();
        },
        (error) => {
          console.error('Error deleting platform:', error);
        }
      );
    }
  }

  deleteRating(ratingId: string, userId: string) {
    if (confirm('Voulez-vous vraiment supprimer cette évaluation ?')) {
      this.userMediaInteractionsService
        .deleteInteraction(ratingId, userId)
        .subscribe(
          () => {
            this.loadRatings();
            this.loadStatistics(); // Met à jour le compteur
          },
          (error) => {
            console.error(
              "Erreur lors de la suppression de l'évaluation :",
              error
            );
            alert("Erreur lors de la suppression de l'évaluation");
          }
        );
    }
  }
}
