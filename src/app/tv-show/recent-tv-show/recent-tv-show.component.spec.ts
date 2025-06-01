import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTvShowComponent } from './recent-tv-show.component';

describe('RecentTvShowComponent', () => {
  let component: RecentTvShowComponent;
  let fixture: ComponentFixture<RecentTvShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentTvShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentTvShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
