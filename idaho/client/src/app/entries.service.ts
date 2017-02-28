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

  /**
   * Return the number of entries for the logged-in user.
   */
  getNumEntries() {
    return this.authHttp
      .get(environment.entriesCountUrl)
      .map(response => response.json())
      .catch(error => {
        console.error(error);
        return Observable.of(error);
      });
  }

  /**
   * Return list of all title objects for logged-in user.
   *
   * Each object contains a encrypted title string and an id.
   */
  getTitles() {
    return this.authHttp
      .get(environment.entriesTitlesUrl)
      .map(response => response.json())
      .catch(error => {
        console.error(error);
        return Observable.of(error);
      });
  }

  /**
   * Return list of (paginated) entry objects for logged-in user.
   *
   * The chunk/page to get is determined by the optional entriesUrl.
   * If it is not passed, the first chunk/page is retrieved.
   */
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
