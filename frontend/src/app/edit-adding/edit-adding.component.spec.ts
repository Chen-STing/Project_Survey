import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddingComponent } from './edit-adding.component';

describe('EditAddingComponent', () => {
  let component: EditAddingComponent;
  let fixture: ComponentFixture<EditAddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
