import { Injectable } from '@angular/core';

declare var sjcl: any;  // sjcl.js as imported in index.html.

export interface Encrypted {
  "adata": string;
  "cipher": string;
  "ct": string;
  "iter": number;
  "iv": string;
  "ks": number;
  "mode": string;
  "salt": string;
  "ts": number;
  "v": number;
}

@Injectable()
export class EncryptionService {

  constructor() { }

  encrypt(password: string, text: string): Encrypted {
    return sjcl.encrypt(password, text);
  }

  decrypt(password: string, encrypted: Encrypted): string {
    return sjcl.decrypt(password, encrypted);
  }

  toEncryptedString(password: string, text: string): string {
    return JSON.stringify(this.encrypt(password, text));
  }

  fromEncryptedString(password: string,
                      stringifiedEncrypted: string): string {
    try {
      var encrypted: Encrypted = JSON.parse(stringifiedEncrypted);
    }
    catch(err) {
      console.error('Data is malformed and can not be decrypted.');
      return stringifiedEncrypted;
    }
    var decrypted = this.decrypt(password, encrypted);
    return decrypted;
  }
}
