import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { SessionListComponent } from './session-list/session-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'users/profile', component: UserProfileComponent },
  { path: 'users/profile/:id', component: UserProfileComponent },
  { path: 'users/list', component: UserListComponent },
  { path: 'users/form', component: UserFormComponent },
  { path: 'users/form/:id', component: UserFormComponent },
  { path: 'sessions/list', component: SessionListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
