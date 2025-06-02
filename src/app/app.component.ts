import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { LucideAngularModule, House, LogIn, UserPlus, User, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly House = House;
  readonly LogIn = LogIn;
  readonly UserPlus = UserPlus;
  readonly User = User;
  readonly LogOut = LogOut;

  title = 'Sofa y Manta';
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    await this.checkAuthStatus();
  }

  // Check if user is authenticated
  async checkAuthStatus() {
    try {
      const { data } = await this.authService.getUser();
      this.currentUser = data.user;
    } catch (error) {
      this.currentUser = null;
      console.log('No hay usuario autenticado');
    }
  }

  // Handle logout
  async logout(event: Event) {
    event.preventDefault();

    try {
      await this.authService.signOut();
      this.currentUser = null;
      this.router.navigate(['/signin']);
      console.log('Cierre de sesión exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
