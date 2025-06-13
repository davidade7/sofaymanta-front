import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent implements OnInit {
  @Input() text: string = 'Volver';
  @Input() route: string | null = null;
  @Input() color: 'primary' | 'secondary' | 'light' | 'dark' = 'secondary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() icon: boolean = true;

  ArrowLeft = ArrowLeft;

  constructor(
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  goBack(): void {
    if (this.route) {
      this.router.navigateByUrl(this.route);
    } else {
      this.location.back();
    }
  }
}
