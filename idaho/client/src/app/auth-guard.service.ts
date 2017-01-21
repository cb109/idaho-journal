import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router) {}

  // FIXME: This is buggy as when reloading the page the initial
  //   value of 'isLoggedIn' is always false, but may change when
  //   the promise resolves. We need to wait for it and work with
  //   Observables here, probably also in the auth.service.ts.
  canActivate() {
    if (!this.authService.isLoggedIn) {
      console.log('You must be logged in to view this. Redirecting...');
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

}