import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { House, LogIn, LogOut, Menu, User, UserPlus, X } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sofa y Manta';
  currentUser: any = null;
  menuOpen = false;

  // Icons
  House = House;
  LogIn = LogIn;
  LogOut = LogOut;
  Menu = Menu;
  X = X;
  User = User;
  UserPlus = UserPlus;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  // Check authentication status
  async checkAuthStatus() {
    try {
      const { data } = await this.authService.getUser();
      this.currentUser = data.user;
    } catch (error) {
      this.currentUser = null;
    }
  }

  // Toggle menu visibility
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Close menu (after navigation)
  closeMenu() {
    this.menuOpen = false;
  }

  // Handle logout
  async logout(event: Event) {
    event.preventDefault();

    try {
      await this.authService.signOut();
      this.currentUser = null;
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
