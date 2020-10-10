import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  // { path: '', component: DashboardComponent },
  { path: '', component: UserListComponent },
  { path: 'users', component: UserListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
