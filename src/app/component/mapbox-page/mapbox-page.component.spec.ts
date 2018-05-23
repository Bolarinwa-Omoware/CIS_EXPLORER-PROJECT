import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxPageComponent } from './mapbox-page.component';

describe('MapboxPageComponent', () => {
  let component: MapboxPageComponent;
  let fixture: ComponentFixture<MapboxPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapboxPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
