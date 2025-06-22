import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentUser: any = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      const { data } = await this.authService.getUser();
      this.currentUser = data.user;
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
