import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCardVariantComponent } from './person-card-variant.component';

describe('PersonCardComponent', () => {
  let component: PersonCardVariantComponent;
  let fixture: ComponentFixture<PersonCardVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonCardVariantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonCardVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
