import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [DashboardComponent, SideBarComponent, UserListComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
