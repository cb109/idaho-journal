import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';
import { ToastrModule } from 'toastr-ng2';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { PasswordService } from './password.service';
import { EncryptionService } from './encryption.service';
import { EntriesService } from './entries.service';

import { routing, routedComponents } from './app.routing';
import { AppComponent } from './app.component';

// Workaround for: https://github.com/auth0/angular2-jwt/issues/258
// TODO: See if we can import and use AUTH_PROVIDERS instead.
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  // FIXME: Enable this error again as needed.
  var config = new AuthConfig({noJwtError: true});
  return new AuthHttp(config, http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    NgbModule.forRoot(),
    ToastrModule.forRoot(),

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
