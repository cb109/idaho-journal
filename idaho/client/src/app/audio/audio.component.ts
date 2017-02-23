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

  constructor(private location: Location) { }

  ngOnInit() {
    this.setup();
  }

  setup(): void {
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

      var preview = document.getElementById('audioPreview');
      while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
      }
      preview.appendChild(audio);
    });

    this.recorder.initStream();
  }

  start(): void {
    this.clearPreview();
    this.recorder.start();
  }

  stop(): void {
    this.recorder.stop();
  }

  clearPreview(): void {
    var preview = document.getElementById('audioPreview');
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  }

  abort() {
    this.location.back();
  }
}
