import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  private scrollAmount = 0;
  private scrollInterval: any;

  ngAfterViewInit() {
    // Initialisation si nécessaire
  }

  ngOnDestroy() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  scrollLeft() {
    const container = this.carouselTrack.nativeElement;
    const scrollWidth = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollWidth, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.carouselTrack.nativeElement;
    const scrollWidth = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollWidth, behavior: 'smooth' });
  }
}
