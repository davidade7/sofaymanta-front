import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  TrendingUp,
  Star,
  MessageSquare,
  Heart,
} from 'lucide-angular';

@Component({
  selector: 'app-guest-welcome-section',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './guest-welcome-section.component.html',
  styleUrl: './guest-welcome-section.component.css',
})
export class GuestWelcomeSectionComponent {
  // Icons
  TrendingUp = TrendingUp;
  Star = Star;
  MessageSquare = MessageSquare;
  Heart = Heart;
}
