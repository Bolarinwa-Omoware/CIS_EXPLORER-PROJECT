import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureLayersDialogComponent } from './feature-layers-dialog.component';

describe('FeatureLayersDialogComponent', () => {
  let component: FeatureLayersDialogComponent;
  let fixture: ComponentFixture<FeatureLayersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureLayersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureLayersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
