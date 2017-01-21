import { Component, OnInit } from '@angular/core';

import { Entry, EntriesService } from '../entries.service';
import { Encrypted, EncryptionService } from '../encryption.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  private _encryptedEntries: Entry[] = [];
  decryptedEntries: Entry[] = [];

  constructor(private entriesService: EntriesService,
              private encryptionService: EncryptionService) { }

  ngOnInit() {
    this.entriesService.getEntries()
      .then(entries => {
        this._encryptedEntries = entries.slice().reverse();

        // Decrypt the collected entries from the backend.
        for (var i = 0; i < this._encryptedEntries.length; ++i) {
          var entry: Entry = this._encryptedEntries[i];
          entry.title = this.encryptionService.fromEncryptedString(
            'password', entry.title);
          entry.body = this.encryptionService.fromEncryptedString(
            'password', entry.body);
          this.decryptedEntries.push(entry);
        }
      });
  }
}
