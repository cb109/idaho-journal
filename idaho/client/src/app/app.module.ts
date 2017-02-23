import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';
import { ToastrModule } from 'toastr-ng2';
import { ImageUploadModule } from 'ng2-imageupload';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { PasswordService } from './password.service';
import { EncryptionService } from './encryption.service';
import { EntriesService } from './entries.service';

import { STORAGE_TOKEN_NAME } from './constants';
import { routing, routedComponents } from './app.routing';
import { AppComponent } from './app.component';
import { ImageComponent } from './image/image.component';

// Workaround for: https://github.com/auth0/angular2-jwt/issues/258
// TODO: See if we can import and use AUTH_PROVIDERS instead.
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  var config = new AuthConfig({
    noJwtError: true,  // FIXME: Enable this error again as needed.
    headerPrefix: 'JWT',
    tokenName: STORAGE_TOKEN_NAME,
    tokenGetter: () => sessionStorage.getItem(STORAGE_TOKEN_NAME),
  });
  return new AuthHttp(config, http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
    ImageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    NgbModule.forRoot(),
    ToastrModule.forRoot({
      'preventDuplicates': true,
      'positionClass': 'toast-bottom-full-width',
      'timeOut': 2500,
      'extendedTimeOut': 100,
    }),
    ImageUploadModule,

    routing,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthService,
    AuthGuardService,
    PasswordService,
    EncryptionService,
    EntriesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
