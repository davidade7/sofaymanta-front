import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRaingsComponent } from './all-ratings.component';

describe('AllRaingsComponent', () => {
  let component: AllRaingsComponent;
  let fixture: ComponentFixture<AllRaingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRaingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllRaingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
