import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

import { Entry } from './entry';
import { environment } from '../environments/environment';

@Injectable()
export class EntriesService {

  constructor(private authHttp: AuthHttp) { }

  getEntries(entriesUrl?: string) {
    if (!entriesUrl) {
      var entriesUrl = environment.entriesUrl;
    }
    return this.authHttp
      .get(entriesUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}