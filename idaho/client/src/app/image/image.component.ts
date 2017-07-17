import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { ToastrService } from 'toastr-ng2';
import { AuthHttp } from 'angular2-jwt';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

import { Entry } from '../entry';
import { environment } from '../../environments/environment';
import { PasswordService } from '../password.service';
import { EncryptionService } from '../encryption.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor(private authHttp: AuthHttp,
              private passwordService: PasswordService,
              private encryptionService: EncryptionService,
              private location: Location,
              private toastr: ToastrService,
              private element: ElementRef) {}
  ngOnInit() {
  }

  title: string = "";
  image: string = "";

  busy : boolean = false;

  maxImageSize = environment.maxImageSize;
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: this.maxImageSize,
    resizeMaxWidth: this.maxImageSize,
  };

  imageSelected(imageResult: ImageResult) {
    this.image = (imageResult.resized &&
                  imageResult.resized.dataURL ||
                  imageResult.dataURL);

    if (!this.title) {
      this.title = imageResult.file.name;
    }
  }

  private createImageEntry(title: string, image: string): Entry {
    var password = this.passwordService.retrieve();
    if (!password) {
      throw('Could not retrieve encryption password, aborting.')
    }
    var encryptedTitle = this.encryptionService.toEncryptedString(
        password, title.trim());
    var encryptedImage = this.encryptionService.toEncryptedString(
        password, image.trim());
    var entry = {'title': encryptedTitle,
                 'body': encryptedImage,
                 'kind': 'image'};
    return entry
  }

  publishImageEntry(title: string): void {
    this.busy = true;

    var entry = this.createImageEntry(title, this.image);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });

    this.authHttp
      .post(environment.entriesUrl, entry, options)
      .catch(error => {
        this.busy = false;
        console.error(error);
        this.toastr.error(
          'Your image entry could not be published: ' + error._body,
          'Publish failed');
        return Observable.of(error);
      })
      .subscribe(response => {
        this.busy = false;
        if (response.ok) {
          this.toastr.success(
            '"' + title + '" has been published.',
            'Publish successful');

          this.title = '';
          this.image = '';
          this.toastr.info('', 'Form has been reset');
        }
      });
  }

  abort() {
    this.location.back();
  }
}
