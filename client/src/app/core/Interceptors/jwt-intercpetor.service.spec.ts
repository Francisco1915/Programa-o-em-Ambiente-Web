import { TestBed } from '@angular/core/testing';

import { JwtIntercpetorService } from './jwt-intercpetor.service';

describe('JwtIntercpetorService', () => {
  let service: JwtIntercpetorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtIntercpetorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
