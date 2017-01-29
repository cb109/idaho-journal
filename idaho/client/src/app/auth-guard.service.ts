import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.verifyToken()
      .map(tokenValid => {
        if (!tokenValid) {
          console.log('You must be logged in to view this. Redirecting...');
          this.router.navigateByUrl('/login');
          return false;
        }
        return true;
      })
      .first();  // Make sure the Observable completes.
  }
}
