import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent implements OnInit {
  @Input() person: any;
  Users = Users;

  constructor(
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // Initialisation si nécessaire
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://placehold.co/500x750?text=Imagen+no+disponible&font=open-sans';
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  navigateToDetails() {
    console.log('Navigating to person details:', this.person);
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
      case 'Acting': return 'Actuación';
      case 'Directing': return 'Dirección';
      case 'Writing': return 'Guion';
      case 'Production': return 'Producción';
      case 'Crew': return 'Equipo';
      case 'Visual Effects': return 'Efectos visuales';
      case 'Sound': return 'Sonido';
      default: return this.person.known_for_department;
    }
  }

  truncateName(name: string): string {
    if (!name) return '';
    return name.length > 24 ? name.substring(0, 22) + '...' : name;
  }
}
