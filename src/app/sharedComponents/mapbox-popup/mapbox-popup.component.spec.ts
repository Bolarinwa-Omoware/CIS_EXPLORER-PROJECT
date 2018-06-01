import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxPopupComponent } from './mapbox-popup.component';

describe('MapboxPopupComponent', () => {
  let component: MapboxPopupComponent;
  let fixture: ComponentFixture<MapboxPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapboxPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
