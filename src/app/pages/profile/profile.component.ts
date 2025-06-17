import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService, UserProfile } from '../../services/userProfile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Save, Loader2 } from 'lucide-angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: UserProfile | null = null;

  isLoading = true;
  isCreatingProfile = false;
  isUpdatingProfile = false;

  profileUpdateSuccess = false;
  profileUpdateError = '';

  Save = Save;
  Loader2 = Loader2;

  // Stockage temporaire de l'ID utilisateur
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  async loadUserProfile() {
    this.isLoading = true;

    try {
      // Utiliser la méthode getUser existante pour obtenir les données de l'utilisateur
      const { data, error } = await this.authService.getUser();

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Utilisateur non connecté');
      }

      this.userId = data.user.id;

      // Une fois l'ID utilisateur obtenu, on charge le profil
      this.userProfileService.getUserProfile(this.userId).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: profile => {
          this.userProfile = profile;
          this.profileForm.patchValue({
            username: profile.username
          });
        },
        error: error => {
          console.log('Aucun profil trouvé ou erreur:', error);
          this.isLoading = false;
          // Pas de profil trouvé, l'utilisateur pourra en créer un
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      this.isLoading = false;
      this.profileUpdateError = 'Impossible de charger les données utilisateur. Veuillez vous connecter.';
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      this.router.navigate(['/login']);
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    const profileData = {
      username: this.profileForm.value.username
    };

    if (this.userProfile) {
      // Mise à jour du profil existant (à implémenter quand le backend aura cette route)
      this.updateProfile(profileData);
    } else {
      // Création d'un nouveau profil
      this.createProfile(profileData);
    }
  }

  createProfile(profileData: any) {
    this.isCreatingProfile = true;
    this.profileUpdateSuccess = false;
    this.profileUpdateError = '';

    this.userProfileService.createUserProfile(this.userId, profileData).pipe(
      finalize(() => this.isCreatingProfile = false)
    ).subscribe({
      next: profile => {
        this.userProfile = profile;
        this.profileUpdateSuccess = true;
      },
      error: error => {
        console.error('Erreur lors de la création du profil:', error);
        this.profileUpdateError = error.message || 'Erreur lors de la création du profil';
      }
    });
  }

  updateProfile(profileData: any) {
    this.isUpdatingProfile = true;
    this.profileUpdateSuccess = false;
    this.profileUpdateError = '';

    // Pour l'instant, nous simulons juste la fin de la mise à jour
    this.isUpdatingProfile = false;
    console.warn('Fonction de mise à jour du profil pas encore implémentée');
  }
}
