import { Component, OnInit } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { ToastrService } from 'toastr-ng2';
import { AuthHttp } from 'angular2-jwt';

import { environment } from '../../environments/environment';
import { Entry } from '../entry';
import { EntriesService } from '../entries.service';
import { Encrypted, EncryptionService } from '../encryption.service';
import { PasswordService } from '../password.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  private _encryptedEntries: Entry[] = [];
  decryptedEntries: Entry[] = [];

  constructor(private authHttp: AuthHttp,
              private entriesService: EntriesService,
              private passwordService: PasswordService,
              private encryptionService: EncryptionService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.decryptEntries();
  }

  decryptEntries() {
    this.entriesService.getEntries()
      .then(entries => {
        this._encryptedEntries = entries.slice().reverse();

        // Decrypt the collected entries from the backend.
        var password = this.passwordService.retrieve();
        if (!password) {
          throw('Could not retrieve encryption password, aborting.')
        }
        for (var i = 0; i < this._encryptedEntries.length; ++i) {
          var entry: Entry = this._encryptedEntries[i];
          entry.title = this.encryptionService.fromEncryptedString(password,
                                                                   entry.title);
          entry.body = this.encryptionService.fromEncryptedString(password,
                                                                  entry.body);
          this.decryptedEntries.push(entry);
        }
      });
  }
  deleteEntry(entry: Entry): void {
    var deleteEntryUrl = environment.entriesUrl + entry.id + '/';
    var headers = new Headers({});
    var options = new RequestOptions({ headers: headers });
    this.authHttp
      .delete(deleteEntryUrl, options)
      .catch(error => {
        console.error(error);
        this.toastr.error(
          'Your entry could not be deleted: ' + error._body,
          'Removal failed');
        return Observable.of(error);
      })
      .subscribe(response => {
        // Update frontend as well.
        var idx = this.decryptedEntries.indexOf(entry);
        this.decryptedEntries.splice(idx, 1);

        if (response.ok) {
          this.toastr.success(
            '"' + entry.title + '" has been deleted.',
            'Removal successful');
        }
      });
  }
}
