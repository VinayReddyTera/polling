import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin','owner','sales','user','access-dashboard']
    }
  },
  {
    path: '**',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin','owner','sales','user','access-dashboard']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
