import { TestBed } from '@angular/core/testing';

import { DeploymentLog } from './deployment-log';

describe('DeploymentLog', () => {
  let service: DeploymentLog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeploymentLog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
