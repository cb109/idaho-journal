import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router) {}

  canActivate() {
    if (!this.authService.isLoggedIn) {
      console.log('You must be logged in to view this. Redirecting...');
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

}