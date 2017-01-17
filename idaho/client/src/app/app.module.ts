import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';

import { routing, routedComponents } from './app.routing';
import { AppComponent } from './app.component';

// Workaround for: https://github.com/auth0/angular2-jwt/issues/258
// TODO: See if we can import and use AUTH_PROVIDERS instead.
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
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
    routing,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [ Http, RequestOptions ]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
