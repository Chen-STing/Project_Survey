import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackDirectionsComponent } from './back-directions.component';

describe('BackDirectionsComponent', () => {
  let component: BackDirectionsComponent;
  let fixture: ComponentFixture<BackDirectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackDirectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
