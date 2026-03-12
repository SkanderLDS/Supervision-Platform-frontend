import { TestBed } from '@angular/core/testing';

import { Supervision } from './supervision';

describe('Supervision', () => {
  let service: Supervision;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Supervision);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
