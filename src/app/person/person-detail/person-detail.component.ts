import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { SerieCardComponent } from '../../shared/serie-card/serie-card.component';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { TopButtonComponent } from '../../shared/top-button/top-button.component';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, MovieCardComponent, SerieCardComponent, BackButtonComponent, TopButtonComponent],
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {
  person: any = null;
  credits: any = null;
  loading: boolean = true;
  error: string | null = null;
  activeTab: 'biography' | 'movies' | 'series' = 'biography';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (id) {
          this.loading = true;
          return this.personService.getPerson(id).pipe(
            catchError(err => {
              console.error('Error al cargar datos de la persona:', err);
              this.error = 'No se pudo cargar la información de la persona.';
              this.loading = false;
              return of(null);
            })
          );
        }
        return of(null);
      })
    ).subscribe(data => {
      this.person = data;

      if (data && data.id) {
        this.getPersonCredits(data.id);
      } else {
        this.loading = false;
      }
    });
  }

  getPersonCredits(personId: number): void {
    this.personService.getPersonCredits(personId).pipe(
      catchError(err => {
        console.error('Error al cargar créditos:', err);
        return of(null);
      })
    ).subscribe(credits => {
      this.credits = credits;
      this.loading = false;
    });
  }

  getFormattedDate(dateString: string | null): string {
    if (!dateString) return 'Desconocida';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAge(birthDate: string, deathDate: string | null = null): string {
    if (!birthDate) return 'Edad desconocida';

    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();

    let age = end.getFullYear() - birth.getFullYear();

    // Ajustar si todavía no ha cumplido años este año
    if (
      end.getMonth() < birth.getMonth() ||
      (end.getMonth() === birth.getMonth() && end.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} años`;
  }

  getImageUrl(path: string | null): string {
    if (!path) return 'https://placehold.co/500x750?text=Imagen+no+disponible&font=open-sans';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getGender(genderCode: number): string {
    if (genderCode === 0) return 'No especificado';
    if (genderCode === 1) return 'Femenino';
    if (genderCode === 2) return 'Masculino';
    if (genderCode === 3) return 'No binario';
    return 'No especificado';
  }

  changeTab(tab: 'biography' | 'movies' | 'series'): void {
    this.activeTab = tab;
  }

  navigateToDetail(type: string, id: number): void {
    if (type === 'movie') {
      this.router.navigate(['/movie/detail', id]);
    } else if (type === 'tv') {
      this.router.navigate(['/serie/detail', id]);
    }
  }

  translateDepartment(department: string): string {
  const translations: { [key: string]: string } = {
    'Acting': 'Actuación',
    'Directing': 'Dirección',
    'Writing': 'Guion',
    'Production': 'Producción',
    'Crew': 'Equipo',
    'Visual Effects': 'Efectos visuales',
    'Sound': 'Sonido',
    'Camera': 'Cámara',
    'Editing': 'Edición',
    'Art': 'Arte',
    'Costume & Make-Up': 'Vestuario y Maquillaje'
  };

  return translations[department] || department;
}

// Obtiene películas donde la persona aparece como actor/actriz
getMoviesFromCast(): any[] {
  if (!this.credits || !this.credits.cast) return [];
  return this.credits.cast.filter((item: any) =>
    item.media_type === 'movie' || (item.title && !item.name));
}

// Obtiene películas donde la persona es parte del equipo técnico
getMoviesFromCrew(): any[] {
  if (!this.credits || !this.credits.crew) return [];
  return this.credits.crew.filter((item: any) =>
    item.media_type === 'movie' || (item.title && !item.name));
}

// Obtiene series donde la persona aparece como actor/actriz
getSeriesFromCast(): any[] {
  if (!this.credits || !this.credits.cast) return [];
  return this.credits.cast.filter((item: any) =>
    item.media_type === 'tv' || (item.name && !item.title));
}

// Obtiene series donde la persona es parte del equipo técnico
getSeriesFromCrew(): any[] {
  if (!this.credits || !this.credits.crew) return [];
  return this.credits.crew.filter((item: any) =>
    item.media_type === 'tv' || (item.name && !item.title));
}
}
