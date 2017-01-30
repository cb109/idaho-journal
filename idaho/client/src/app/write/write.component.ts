import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { ToastrService } from 'toastr-ng2';
import { AuthHttp } from 'angular2-jwt';

import { environment } from '../../environments/environment';
import { PasswordService } from '../password.service';
import { EncryptionService } from '../encryption.service';

interface TextEntry {
  author?: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {

  constructor(private authHttp: AuthHttp,
              private passwordService: PasswordService,
              private encryptionService: EncryptionService,
              private location: Location,
              private toastr: ToastrService) {}

  ngOnInit() {
  }

  private createTextEntry(title: string, message: string): TextEntry {
    var password = this.passwordService.retrieve();
    if (!password) {
      throw('Could not retrieve encryption password, aborting.')
    }
    var encryptedTitle = this.encryptionService.toEncryptedString(password,
                                                                  title);
    var encryptedMessage = this.encryptionService.toEncryptedString(password,
                                                                    message);
    var entry = {'title': encryptedTitle, 'body': encryptedMessage}
    return entry
  }

  publishTextEntry(title: string, message: string, form: any): void {
    var entry = this.createTextEntry(title, message);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });

    this.authHttp
      .post(environment.entriesUrl, entry, options)
      .catch(error => {
        console.error(error);
        this.toastr.error(
          'Your text entry could not be published: ' + error._body,
          'Publish failed');
        return Observable.of(error);
      })
      .subscribe(response => {
        if (response.ok) {
          this.toastr.success(
            '"' + title + '" has been published.',
            'Publish successful');
          form.reset();
          this.toastr.info('', 'Form has been reset');
        }
      });
  }

  abort() {
    this.location.back();
  }

}
