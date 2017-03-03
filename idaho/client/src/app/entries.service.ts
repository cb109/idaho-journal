import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthHttp } from 'angular2-jwt';

import { Entry } from './entry';
import { environment } from '../environments/environment';

@Injectable()
export class EntriesService {

  constructor(private authHttp: AuthHttp) { }

  getNumEntries() {
    return this.authHttp
      .get(environment.entriesCountUrl)
      .map(response => response.json())
      .catch(error => {
        console.error(error);
        return Observable.of(error);
      });
  }

  getEntries(entriesUrl?: string) {
    if (!entriesUrl) {
      var entriesUrl = environment.entriesUrl;
    }
    return this.authHttp
      .get(entriesUrl)
      .map(response => response.json())
      .catch(error => {
        console.error(error);
        return Observable.of(error);
      });
  }
}
