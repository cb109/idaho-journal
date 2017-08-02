import { Component } from '@angular/core';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) { }

  /**
   * Return whether the classes string contains the cls string.
   * @classes: A string like 'class1 class2 class3'
   * @cls: A string like 'class2'
   */
  hasClass(classes, cls): boolean {
    // Add some whitespace for an order-independent check.
    return (' ' + classes + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}
