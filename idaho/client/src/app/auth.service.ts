import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

export interface Token {
  token: string;
}

@Injectable()
export class AuthService {

  public status = false;

  private tokenName = 'jwt';
  private tokenVerifyUrl = 'http://localhost:8000/api/token-verify/';
  private tokenAuthUrl = 'http://localhost:8000/api/token-auth/';

  constructor(private http: Http,
              private router: Router) {
    this.isLoggedIn()
      .then(isLoggedIn => this.status = isLoggedIn);
  }

  isLoggedIn(): Promise<boolean> {
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
        this.status = token !== undefined;
      })
      .catch(this.handleError);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenName);
    this.router.navigateByUrl('/login');
  }

  abort(): void {
    alert('abort');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
