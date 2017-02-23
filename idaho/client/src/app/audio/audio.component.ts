import { Component, OnInit } from '@angular/core';

declare var Recorder: any;  // this.recorder.min.js as imported in index.html.

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  recorder: any;

  constructor() { }

  ngOnInit() {
    this.setup();
  }

  setup(): void {
    this.recorder = new Recorder({
      encoderPath: '../../assets/recorderjs-opus/encoderWorker.min.js'
    });

    this.recorder.addEventListener("dataAvailable", function(e) {
      var dataBlob = new Blob( [e.detail], { type: 'audio/ogg' } );
      var fileName = new Date().toISOString() + ".ogg";
      var url = URL.createObjectURL( dataBlob );

      var audio = document.createElement('audio');
      audio.controls = true;
      audio.src = url;

      var link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.innerHTML = link.download;

      var li = document.createElement('li');
      li.appendChild(link);
      li.appendChild(audio);

      document.body.appendChild(li);
    });

    this.recorder.initStream();
  }
}
