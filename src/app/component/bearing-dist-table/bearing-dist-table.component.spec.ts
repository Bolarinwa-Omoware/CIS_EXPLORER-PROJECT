import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BearingDistTableComponent } from './bearing-dist-table.component';

describe('BearingDistTableComponent', () => {
  let component: BearingDistTableComponent;
  let fixture: ComponentFixture<BearingDistTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BearingDistTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BearingDistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
