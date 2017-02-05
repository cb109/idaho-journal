import { Injectable } from '@angular/core';

declare var escape, unescape: any;  // Browser helper functions.

@Injectable()
export class PasswordService {

  private passwordName = 'idaho_password';

  constructor() { }

  // Helper functions to support unicode in encrypted data.
  // https://github.com/bitwiseshiftleft/sjcl/issues/53
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa

  // ucs-2 string to base64 encoded ascii
  utoa(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  // base64 encoded ascii to ucs-2 string
  atou(str: string) {
    return decodeURIComponent(escape(window.atob(str)));
  }

  store(password: string): string {
    var base64Password = this.utoa(password);
    sessionStorage.setItem(this.passwordName, base64Password);
    return base64Password;
  }

  retrieve(): string {
    var base64Password = sessionStorage.getItem(this.passwordName);
    if (!base64Password) {
      return '';
    }
    var password = this.atou(base64Password);
    return password;
  }

  clear(): void {
    sessionStorage.removeItem(this.passwordName);
  }
}
