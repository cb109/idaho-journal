import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

declare var Recorder: any;  // this.recorder.min.js as imported in index.html.

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  recorder: any;
  audioUrl: string = '';
  busy: boolean = false;

  constructor(private location: Location) { }

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

    this.recorder.addEventListener("dataAvailable", function(e) {
      var dataBlob = new Blob( [e.detail], { type: 'audio/ogg' } );
      var fileName = new Date().toISOString() + ".ogg";
      var url = URL.createObjectURL( dataBlob );

      // Dynamically create a preview element.
      var audio = document.createElement('audio');
      audio.controls = true;
      audio.src = url;
      audio.id = 'audioPreview';

      var previewContainer = document.getElementById('previewContainer');
      previewContainer.appendChild(audio);
    });

    this.recorder.initStream();
  }

  start(): void {
    this.reset();
    this.busy = true;
    this.recorder.start();
  }

  stop(): void {
    this.busy = false;
    this.recorder.stop();
  }

  reset(): void {
    this.busy = false;
    this.audioUrl = '';

    var previewContainer = document.getElementById('previewContainer');
    while (previewContainer.firstChild) {
      previewContainer.removeChild(previewContainer.firstChild);
    }
  }

  abort() {
    this.location.back();
  }
}
