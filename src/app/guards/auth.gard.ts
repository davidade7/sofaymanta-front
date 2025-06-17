import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data, error } = await this.authService.getUser();

      if (error || !data.user) {
        this.router.navigate(['/signin']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
