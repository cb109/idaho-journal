import { Component, OnInit } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { ToastrService } from 'toastr-ng2';
import { AuthHttp } from 'angular2-jwt';

import { environment } from '../../environments/environment';
import { Title } from '../title';
import { Entry } from '../entry';
import { EntriesService } from '../entries.service';
import { EncryptionService } from '../encryption.service';
import { PasswordService } from '../password.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  busy: boolean = false;

  titleFilter: string = '';
  private _encryptedTitles: Title[] = [];
  decryptedTitles: Title[] = [];

  entriesCount: number = 0;
  private _encryptedEntries: Entry[] = [];
  decryptedEntries: Entry[] = [];
  fetchNextEntriesUrl: string;

  constructor(private authHttp: AuthHttp,
              private entriesService: EntriesService,
              private passwordService: PasswordService,
              private encryptionService: EncryptionService,
              private toastr: ToastrService) { }

  /**
   * Get initial entries.
   */
  ngOnInit() {
    this.entriesService.getNumEntries()
      .subscribe(response => {
        this.entriesCount = response;
      });

    this.getDecryptedTitles();
    this.getDecryptedEntries();
  }

  /**
   * Apply the current title filter value to the entries backend query.
   *
   * This gets all titles at once (no pagination).
   */
  getDecryptedTitles(): void {
    this.busy = true;

    this.entriesService.getTitles()
      .catch(error => {
        this.busy = false;
        console.error(error);
        return Observable.of(error);
      })
      .subscribe(response => {
        this.busy = false;

        var password = this.passwordService.retrieve();
        if (!password) {
          throw('Could not retrieve encryption password, aborting.')
        }

        // Decrypt the collected titles from the backend.
        this._encryptedTitles = response as Title[];
        for (var i = 0; i < this._encryptedTitles.length; ++i) {
          var title: Title = this._encryptedTitles[i];
          title.title = this.encryptionService.fromEncryptedString(password,
                                                                   title.title);
          this.decryptedTitles.push(title);
        }
      });
  }

  /**
   * Get entries from API and decrypt them for display.
   *
   * This query is paginated to allow reading chunk by chunk.
   */
  getDecryptedEntries() {
    this.busy = true;

    this.entriesService.getEntries(this.fetchNextEntriesUrl)
      .catch(error => {
        this.busy = false;
        console.error(error);
        return Observable.of(error);
      })
      .subscribe(response => {
        this.busy = false;

        // This will trigger loading the next paginated results.
        // It will become null when fully consumed, which will
        // cause the entriesService to fall back to its default.
        this.fetchNextEntriesUrl = response.next;

        var password = this.passwordService.retrieve();
        if (!password) {
          throw('Could not retrieve encryption password, aborting.')
        }

        // Decrypt the collected entries from the backend.
        this._encryptedEntries = response.results as Entry[];
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

  /**
   * Fetch the next entries from the API when scrolled to bottom.
   */
  onScroll() {
    if (!this.fetchNextEntriesUrl || this.busy) {
      return;
    }
    var windowHeight = ("innerHeight" in window ?
                        window.innerHeight :
                        document.documentElement.offsetHeight);
    var body = document.body, html = document.documentElement;
    var docHeight = Math.max(body.scrollHeight, body.offsetHeight,
                             html.clientHeight, html.scrollHeight,
                             html.offsetHeight);
    var windowBottom = windowHeight + window.pageYOffset;
    var bottomReached = windowBottom >= docHeight;
    if (bottomReached) {
      this.getDecryptedEntries();
    }
  }

  /**
   * Toggle UI for the entry which title was clicked.
   */
  toggleEntryUI(entry: Entry): void {
    entry['_showUI'] = entry['_showUI'] ? false : true
  }

  /**
   * Delete the given entry and show a result notification.
   */
  deleteEntry(entry: Entry): void {
    var deletionConfirmed = confirm('Do you really want to delete ' +
                                    entry.title + '?');
    if (!deletionConfirmed) {
      return;
    }

    // FIXME: Move this to the entriesService.
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
        if (response.ok) {
          this.toastr.success(
            '"' + entry.title + '" has been deleted.',
            'Removal successful');
          // Update frontend as well.
          var idx = this.decryptedEntries.indexOf(entry);
          this.decryptedEntries.splice(idx, 1);
        }
      });
  }
}
