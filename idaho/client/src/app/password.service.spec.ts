/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordService]
    });
  });

  it('should ...', inject([PasswordService], (service: PasswordService) => {
    expect(service).toBeTruthy();
  }));
});
