import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogByCoordinatesComponent } from './dialog-by-coordinates.component';

describe('DialogByCoordinatesComponent', () => {
  let component: DialogByCoordinatesComponent;
  let fixture: ComponentFixture<DialogByCoordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogByCoordinatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogByCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
