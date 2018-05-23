import { TestBed, inject } from '@angular/core/testing';

import { PropertyVatService } from './property-vat.service';

describe('PropertyVatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyVatService]
    });
  });

  it('should be created', inject([PropertyVatService], (service: PropertyVatService) => {
    expect(service).toBeTruthy();
  }));
});
