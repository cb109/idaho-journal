import { Injectable } from '@angular/core';

@Injectable()
export class PasswordService {

  private passwordName = 'idaho_password';

  constructor() { }

  store(password: string): string {
    console.log('storing password as base64');
    var base64Password = btoa(password);
    sessionStorage.setItem(this.passwordName, base64Password);
    return base64Password;
  }

  retrieve(): string {
    console.log('retrieving password from base64');
    var base64Password = sessionStorage.getItem(this.passwordName);
    if (!base64Password) {
      return '';
    }
    var password = atob(base64Password);
    return password;
  }
}
