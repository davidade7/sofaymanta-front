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

export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur est connecté et est admin
      const isAdmin = await this.authService.isCurrentUserAdmin();

      if (!isAdmin) {
        // Vérifier d'abord si l'utilisateur est connecté
        const { data } = await this.authService.getUser();

        if (!data.user) {
          console.log('User not authenticated, redirecting to signin');
          this.router.navigate(['/signin']);
        } else {
          console.log('User is not admin, redirecting to home');
          this.router.navigate(['/']);
        }
        return false;
      }

      console.log('User is admin, allowing access');
      return true;
    } catch (error) {
      console.error('Error in admin guard:', error);
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
