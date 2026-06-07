import { TestBed } from '@angular/core/testing';

import { CompanyConfig } from './company-config';

describe('CompanyConfig', () => {
  let service: CompanyConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
