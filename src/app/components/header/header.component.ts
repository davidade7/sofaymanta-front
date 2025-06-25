import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LogIn, LogOut, Menu, User, UserPlus, X } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  menuOpen = false;
  logoPath = '/images/logo/logo.png';
  isAdmin = false;

  // Icons
  LogIn = LogIn;
  LogOut = LogOut;
  Menu = Menu;
  X = X;
  User = User;
  UserPlus = UserPlus;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.setupAuthListener();
  }

  async checkAuthStatus() {
    try {
      const { data } = await this.authService.getUser();
      this.currentUser = data.user;
    } catch (error) {
      this.currentUser = null;
    }
  }

  setupAuthListener() {
    this.authService.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUser = session?.user || null;
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  async logout(event: Event) {
    event.preventDefault();

    try {
      await this.authService.signOut();
      this.currentUser = null;
      this.closeMenu();

      // Rediriger vers la home et actualiser la page
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
