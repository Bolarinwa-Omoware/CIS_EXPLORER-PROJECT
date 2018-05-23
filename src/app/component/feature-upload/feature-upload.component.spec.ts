import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureUploadComponent } from './feature-upload.component';

describe('FeatureUploadComponent', () => {
  let component: FeatureUploadComponent;
  let fixture: ComponentFixture<FeatureUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
