import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowUp } from 'lucide-angular';

@Component({
  selector: 'app-top-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './top-button.component.html',
  styleUrl: './top-button.component.css'
})
export class TopButtonComponent implements OnInit {
  @Input() color: 'primary' | 'secondary' | 'light' | 'dark' = 'secondary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showAfter: number = 300; // Muestra el botón después de hacer scroll de 300px
  @Input() text: string | null = null; // Text es opcional
  @Input() smooth: boolean = true; // Scroll suave por defecto
  @Input() showAlways: boolean = false; // Si se muestra siempre o solo después de scroll

  visible: boolean = false;
  ArrowUp = ArrowUp;

  constructor() {}

  ngOnInit(): void {
    if (this.showAlways) {
      this.visible = true;
    } else {
      this.checkScrollPosition();
    }
  }

  @HostListener('window:scroll', [])
  checkScrollPosition(): void {
    if (this.showAlways) {
      this.visible = true;
      return;
    }

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.visible = scrollPosition > this.showAfter;
  }

  scrollToTop(): void {
    console.log('Scroll to top clicked');
    if (this.smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }
}
