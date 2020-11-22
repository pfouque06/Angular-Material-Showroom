import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SpinnerComponent } from './themes/spinner/spinner.component';
import { ModalComponent } from './themes/modal/modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IsLoggedGuard } from '../shared/middlewares/guards/is-logged.guard';
import { EmojisComponent } from './themes/emojis/emojis.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'sandbox', component: SandboxComponent },
  { path: 'themes/modal', component: ModalComponent },
  { path: 'themes/spinner', component: SpinnerComponent },
  { path: 'themes/emojis', component: EmojisComponent },
  { path: 'dashboard',
    component: DashboardComponent, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivateChild: [IsLoggedGuard]},
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

