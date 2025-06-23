import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestWelcomeSectionComponent } from './guest-welcome-section.component';

describe('GuestWelcomeSectionComponent', () => {
  let component: GuestWelcomeSectionComponent;
  let fixture: ComponentFixture<GuestWelcomeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestWelcomeSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestWelcomeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
