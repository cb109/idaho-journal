/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordService]
    });
  });

  it('should create a service',
     inject([PasswordService], (service: PasswordService) => {
    expect(service).toBeTruthy();
  }));

  it('should store password as base64 in sessionStorage',
     inject([PasswordService], (service: PasswordService) => {

    service.store('my-password');
    expect(sessionStorage[service._passwordName] === 'bXktcGFzc3dvcmQ=');
  }));

  it('should retrieve password as text from sessionStorage',
     inject([PasswordService], (service: PasswordService) => {

    sessionStorage[service._passwordName] = 'bXktcGFzc3dvcmQ=';
    expect(sessionStorage[service._passwordName] === 'my-password');
  }));
});
