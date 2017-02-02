import { Injectable } from '@angular/core';

@Injectable()
export class PasswordService {

  _passwordName = 'idaho_password';

  constructor() { }

  store(password: string): string {
    var base64Password = btoa(password);
    sessionStorage.setItem(this._passwordName, base64Password);
    return base64Password;
  }

  retrieve(): string {
    var base64Password = sessionStorage.getItem(this._passwordName);
    if (!base64Password) {
      return '';
    }
    var password = atob(base64Password);
    return password;
  }

  clear(): void {
    sessionStorage.removeItem(this._passwordName);
  }
}
