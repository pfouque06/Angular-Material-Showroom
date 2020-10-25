import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { SessionListComponent } from './session-list/session-list.component';
import { IsLoggedGuard } from 'src/app/shared/middlewares/guards/is-logged.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'users/profile', component: UserProfileComponent, canActivate: [IsLoggedGuard] },
  { path: 'users/profile/:id', component: UserProfileComponent, canActivate: [IsLoggedGuard] },
  { path: 'users/list', component: UserListComponent, canActivate: [IsLoggedGuard] },
  { path: 'users/form', component: UserFormComponent, canActivate: [IsLoggedGuard] },
  { path: 'users/form/:id', component: UserFormComponent, canActivate: [IsLoggedGuard] },
  { path: 'sessions/list', component: SessionListComponent, canActivate: [IsLoggedGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
