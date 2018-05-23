import { TestBed, inject } from '@angular/core/testing';

import { TraverseService } from './traverse.service';

describe('TraverseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraverseService]
    });
  });

  it('should be created', inject([TraverseService], (service: TraverseService) => {
    expect(service).toBeTruthy();
  }));
});
