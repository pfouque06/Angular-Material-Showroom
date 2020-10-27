import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-is-logged-guard-alert',
  template: `<div>UNAUTHORIZED ACCESS! Sign-in is required there!</div>`,
  styles: [`
    .snack-bar-success {
      max-width: 600px !important;
      background: green !important;
      color: white !important;
    }

    .snack-bar-error {
      max-width: 600px !important;
      background: darkred !important;
      color: white !important;
    }

    .snack-bar-info {
      max-width: 600px !important;
      background: darkblue !important;
      color: white !important;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class IsLoggedGuardAlertComponent {

  constructor() { }

}
