import { Component, OnInit } from '@angular/core';

import { Entry, EntriesService } from '../entries.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  entries: Entry[];

  constructor(private entriesService: EntriesService) { }

  ngOnInit() {
    this.entriesService.getEntries()
      .then(entries => this.entries = entries.slice().reverse());
  }
}
