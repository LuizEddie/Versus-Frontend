import { TestBed } from '@angular/core/testing';

import { TieBreakerService } from './tie-breaker.service';

describe('TieBreakerService', () => {
  let service: TieBreakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TieBreakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
