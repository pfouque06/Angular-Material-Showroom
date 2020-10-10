import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SpinnerComponent } from './themes/spinner/spinner.component';


@NgModule({
  declarations: [
    CoreComponent,
    HomeComponent,
    SandboxComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule
  ]
})
export class CoreModule { }
