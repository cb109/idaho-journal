import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

export interface Entry {
  title: string;
  body: string;
}

@Injectable()
export class EntriesService {

  private entriesUrl = 'http://localhost:8000/api/entries';

  constructor(private authHttp: AuthHttp) { }

  getEntries() {
    return this.authHttp
      .get(this.entriesUrl)
      .toPromise()
      .then(response => response.json() as Entry[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}