import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-card-variant.component.html',
  styleUrl: './person-card-variant.component.css',
})
export class PersonCardVariantComponent implements OnInit {
  @Input() person: any;

  constructor(private router: Router, private el: ElementRef) {}

  ngOnInit() {
    // Initialisation si nécessaire
  }

  getImageUrl(path: string): string {
    if (!path)
      return 'https://placehold.co/500x750?text=Imagen+no+disponible&font=open-sans';
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  navigateToDetails() {
    if (this.person && this.person.id) {
      // Utilisez la même structure de route que dans app.routes.ts
      this.router.navigate(['/person/detail', this.person.id]);
    } else {
      console.error('Cannot navigate: person ID is missing');
    }
  }

  getKnownFor(): string {
    if (!this.person.known_for_department) return '';

    // Traducir departamentos comunes
    switch (this.person.known_for_department) {
      case 'Acting':
        return 'Actuación';
      case 'Directing':
        return 'Dirección';
      case 'Writing':
        return 'Guion';
      case 'Production':
        return 'Producción';
      case 'Crew':
        return 'Equipo';
      case 'Visual Effects':
        return 'Efectos visuales';
      case 'Sound':
        return 'Sonido';
      default:
        return this.person.known_for_department;
    }
  }

  getRole(): string {
    // Priority order: role (from adaptPersonForCard), character, job
    if (this.person.role) {
      return this.person.role;
    }
    if (this.person.character) {
      return this.person.character;
    }
    if (this.person.job) {
      return this.person.job;
    }
    return '';
  }

  truncateRole(role: string): string {
    if (!role) return '';
    return role.length > 30 ? role.substring(0, 28) + '...' : role;
  }

  truncateName(name: string): string {
    if (!name) return '';
    return name.length > 24 ? name.substring(0, 22) + '...' : name;
  }
}
