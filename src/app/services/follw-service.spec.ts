import { TestBed } from '@angular/core/testing';

import { FollwService } from './follw-service';

describe('FollwService', () => {
  let service: FollwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
