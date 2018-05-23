import { TestBed, inject } from '@angular/core/testing';

import { MapboxGlService } from './mapbox-gl.service';

describe('MapboxGlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapboxGlService]
    });
  });

  it('should be created', inject([MapboxGlService], (service: MapboxGlService) => {
    expect(service).toBeTruthy();
  }));
});
