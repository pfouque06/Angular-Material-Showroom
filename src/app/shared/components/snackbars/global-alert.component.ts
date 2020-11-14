import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-global-alert',
  template: `<div>{{data}}</div>`,
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
export class GlobalAlertComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }

}
