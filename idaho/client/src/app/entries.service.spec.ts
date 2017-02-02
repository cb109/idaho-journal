/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthHttp } from 'angular2-jwt';
declare var jasmine: any;

import { Entry } from './entry';
import { EntriesService } from './entries.service';


const mockEntries = [
  {
    'title': 'encrypted-title-1',
    'body': 'encrypted-message-1',
    'kind': 'text'
  },
  {
    'title': 'encrypted-title-2',
    'body': 'encrypted-message-2',
    'kind': 'text'
  },
  {
    'title': 'encrypted-title-3',
    'body': 'encrypted-message-3',
    'kind': 'text'
  },
]

class MockResponse {
  json() {
    return mockEntries
  }
}

class MockAuthHttp {
  get() {
    return Observable.of(new MockResponse());
  }
}

describe('EntriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntriesService,
        {
          provide: AuthHttp,
          useClass: MockAuthHttp
        }
      ]
    });
  });

  it('should create a service',
     inject([EntriesService], (service: EntriesService) => {
    expect(service).toBeTruthy();
  }));

  it('should return the 3 entries from above',
     async(inject([EntriesService], (service: EntriesService) => {

    service.getEntries().then(result => {
      expect(result).toEqual(mockEntries);
    });
  })));
});
