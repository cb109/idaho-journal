import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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

  entriesUrl = 'http://localhost:8000/api/entries/';

  constructor(private http: Http) {}

  ngOnInit() {}

  private createTextEntry(title: string, message: string): TextEntry {
    var adminId = 1;
    var entry = {'author': adminId, 'title': title, 'body': message}
    return entry
  }

  publishTextEntry(title: string, message: string): void {
    var entry = this.createTextEntry(title, message);
    console.log(entry);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log("sending post!");
    this.http.post(this.entriesUrl, entry, options)
             .subscribe();
  }

}
