import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users } from 'lucide-angular';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {
  @Input() person: any;
  @Output() cardClick = new EventEmitter<number>();
  Users = Users; // Para usar el icono en la plantilla

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/placeholder-person.jpg';
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  onClick(): void {
    this.cardClick.emit(this.person.id);
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
