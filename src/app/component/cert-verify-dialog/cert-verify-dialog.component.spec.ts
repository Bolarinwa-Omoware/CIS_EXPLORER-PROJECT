import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertVerifyDialogComponent } from './cert-verify-dialog.component';

describe('CertVerifyDialogComponent', () => {
  let component: CertVerifyDialogComponent;
  let fixture: ComponentFixture<CertVerifyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertVerifyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertVerifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
