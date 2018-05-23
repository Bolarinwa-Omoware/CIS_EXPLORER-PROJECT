import { TestBed, inject } from '@angular/core/testing';

import { GeoFeaturesService } from './geo-features.service';

describe('GeoFeaturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoFeaturesService]
    });
  });

  it('should be created', inject([GeoFeaturesService], (service: GeoFeaturesService) => {
    expect(service).toBeTruthy();
  }));
});
