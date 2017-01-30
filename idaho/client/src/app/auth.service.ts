import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ToastrService } from 'toastr-ng2';

import { STORAGE_TOKEN_NAME, STORAGE_USER_NAME } from './constants';
import { environment } from '../environments/environment';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {

  isLoggedIn = false;  // FIXME: Remove this state and use Observables instead.

  constructor(private http: Http,
              private router: Router,
              private location: Location,
              private passwordService: PasswordService,
              private toastr: ToastrService) {
  }

  verifyToken(): Observable<boolean> {
    var token = sessionStorage.getItem(STORAGE_TOKEN_NAME);
    if (!token) {
      return Observable.of(false);
    }
    return this.http
      .post(environment.tokenVerifyUrl, {'token': token})
      .map((response: Response) => {
          var validTokenReceived = (
            response && response.json().token !== undefined);
          this.isLoggedIn = true;
          return validTokenReceived;
      })
      .catch(err => {
        this.isLoggedIn = false;
        return Observable.of(false);
      })
  }

  getLoggedInUser(): string {
    return sessionStorage.getItem(STORAGE_USER_NAME) || '';
  }

  // FIXME: Promises are so 2015, use Observables instead.
  login(username: string, password: string) {
    return this.http
      .post(environment.tokenAuthUrl, {'username': username,
                                       'password': password})
      .toPromise()
      .then(response => {
        var token = response.json().token;

        // Validate response, then store user, password and token in
        // the browser session before updating the view.
        this.isLoggedIn = token !== undefined;
        if (this.isLoggedIn) {
          sessionStorage.setItem(STORAGE_USER_NAME, username);
          sessionStorage.setItem(STORAGE_TOKEN_NAME, token);
          this.passwordService.store(password);
          this.toastr.success('You are now logged in.', 'Login successful');
          this.router.navigateByUrl('/');
        }
      })
      .catch(response => {
        this.toastr.error(
          'Could not authenticate. Please check your credentials.',
          'Login failed');
        this.handleError(response);
      });
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_USER_NAME);
    sessionStorage.removeItem(STORAGE_TOKEN_NAME);
    this.passwordService.clear()
    this.isLoggedIn = false;
    this.toastr.success('You have been logged out.', 'Logout successful')
    this.router.navigateByUrl('/login');
  }

  abort(): void {
    this.location.back();
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
