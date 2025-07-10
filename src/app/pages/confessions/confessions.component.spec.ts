import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfessionsComponent } from './confessions.component';

describe('ConfessionsComponent', () => {
  let component: ConfessionsComponent;
  let fixture: ComponentFixture<ConfessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
