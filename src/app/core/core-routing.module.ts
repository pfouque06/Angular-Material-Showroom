import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { SpinnerComponent } from './themes/spinner/spinner.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IsLoggedGuard } from '../shared/guards/is-logged.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'sandbox', component: SandboxComponent },
  { path: 'themes/spinner', component: SpinnerComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard',
    component: DashboardComponent, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [IsLoggedGuard]},
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

