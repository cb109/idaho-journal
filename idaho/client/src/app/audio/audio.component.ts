import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { ToastrService } from 'toastr-ng2';
import { AuthHttp } from 'angular2-jwt';
declare var Recorder: any;  // this.recorder.min.js as imported in index.html.

import { Entry } from '../entry';
import { environment } from '../../environments/environment';
import { PasswordService } from '../password.service';
import { EncryptionService } from '../encryption.service';


@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  recorder: any;
  recording: boolean = false;
  publishing: boolean = false;

  title: string = "";

  constructor(private authHttp: AuthHttp,
              private passwordService: PasswordService,
              private encryptionService: EncryptionService,
              private location: Location,
              private toastr: ToastrService,
              private element: ElementRef) {}

  ngOnInit() {
    this.setup();
  }

  setup(): void {
    this.reset();

    this.recorder = new Recorder({
      numberOfChannels: 1,
      encoderPath: '../../assets/recorderjs-opus/encoderWorker.min.js',
      leaveStreamOpen: true
    });

    // FIXME: We don't have access to the component scope within the
    //  event handler below, which calls for ugly workarounds by storing
    //  and reading data from the DOM.

    this.recorder.addEventListener("dataAvailable", function(e) {
      var blob = new Blob([e.detail], { type: 'audio/ogg' });

      // Convert blob file to base64 string for publishing.
      // Result is stored to the DOM in a hidden element.
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        var base64Data = reader.result;

        var input = document.createElement('input');
        input.type = "text";
        input.src = base64Data;
        input.hidden = true;
        input.id = "resultStorage";

        var resultContainer = document.getElementById('resultContainer');
        previewContainer.appendChild(input);
        // var resultStorage = document.getElementById('resultStorage');
        // console.log(resultStorage.getAttribute('src'));
      }

      // Dynamically create a preview element.
      var audio = document.createElement('audio');
      audio.controls = true;
      audio.src = URL.createObjectURL(blob);
      audio.id = 'audioPreview';

      var previewContainer = document.getElementById('previewContainer');
      previewContainer.appendChild(audio);
    });

    this.recorder.initStream();
  }

  start(): void {
    this.reset();
    this.recording = true;
    this.recorder.start();
  }

  stop(): void {
    this.recording = false;
    this.recorder.stop();
  }

  reset(): void {
    this.recording = false;

    var previewContainer = document.getElementById('previewContainer');
    while (previewContainer.firstChild) {
      previewContainer.removeChild(previewContainer.firstChild);
    }

    var resultContainer = document.getElementById('resultContainer');
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
    }
  }

  private createAudioEntry(title: string, audio: string): Entry {
    var password = this.passwordService.retrieve();
    if (!password) {
      throw('Could not retrieve encryption password, aborting.')
    }
    var encryptedTitle = this.encryptionService.toEncryptedString(password,
                                                                  title);
    var encryptedAudio = this.encryptionService.toEncryptedString(password,
                                                                  audio);
    var entry = {'title': encryptedTitle,
                 'body': encryptedAudio,
                 'kind': 'audio'};
    return entry
  }

  publishAudioEntry(): void {
    this.publishing = true;

    // Fetch base64 audio string from DOM.
    try {
      var resultStorage = document.getElementById('resultStorage');
      var audio = resultStorage.getAttribute('src');
    }
    catch (error) {
      console.error(error);
      this.toastr.error(
        'Could not find a recording to publish: ' + error._body,
        'Publish failed');
      return error;
    }

    var entry = this.createAudioEntry(this.title, audio);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });

    this.authHttp
      .post(environment.entriesUrl, entry, options)
      .catch(error => {
        this.publishing = false;
        console.error(error);
        this.toastr.error(
          'Your audio entry could not be published: ' + error._body,
          'Publish failed');
        return Observable.of(error);
      })
      .subscribe(response => {
        this.publishing = false;
        if (response.ok) {
          this.toastr.success(
            '"' + this.title + '" has been published.',
            'Publish successful');

          this.title = '';
          this.reset();
          this.toastr.info('', 'Form has been reset');
        }
      });
  }

  abort() {
    this.location.back();
  }
}
