import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRatingsComponent } from './all-ratings.component';

describe('AllRaingsComponent', () => {
  let component: AllRatingsComponent;
  let fixture: ComponentFixture<AllRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRatingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
