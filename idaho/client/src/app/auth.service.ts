import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

export interface Token {
  token: string;
}

@Injectable()
export class AuthService {

  isLoggedIn = false;

  private tokenName = 'jwt';
  private tokenVerifyUrl = 'http://localhost:8000/api/token-verify/';
  private tokenAuthUrl = 'http://localhost:8000/api/token-auth/';

  constructor(private http: Http,
              private router: Router,
              private location: Location) { 
    this.checkLoggedIn()
      .then(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  checkLoggedIn(): Promise<boolean> {
    var token = sessionStorage.getItem(this.tokenName);
    if (!token) {
      return Promise.resolve(false);
    }
    return this.http
      .post(this.tokenVerifyUrl, {'token': token})
      .toPromise()
      .then(response => {
        return response.json().token !== undefined;
      })
      .catch(this.handleError);
  }

  login(username: string, password: string) {
    return this.http
      .post(this.tokenAuthUrl, {'username': username,
                                'password': password})
      .toPromise()
      .then(response => {
        var token = response.json().token;
        sessionStorage.setItem(this.tokenName, token);

        // Update login status.
        this.isLoggedIn = token !== undefined;
        if (this.isLoggedIn) {
          this.router.navigateByUrl('/');
        }
      })
      .catch(this.handleError);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenName);
    this.isLoggedIn = false;
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
