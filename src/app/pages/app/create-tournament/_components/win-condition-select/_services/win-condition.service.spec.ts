import { TestBed } from '@angular/core/testing';

import { WinConditionService } from './win-condition.service';

describe('WinConditionService', () => {
  let service: WinConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WinConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
