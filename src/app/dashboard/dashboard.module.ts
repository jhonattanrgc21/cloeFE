import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { GatheringCentersComponent } from './pages/gathering-centers/gathering-centers.component';
import { UsersComponent } from './pages/users/users.component';
import { ClasificationComponent } from './pages/clasification/clasification.component';
import { SeparationComponent } from './pages/separation/separation.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SummaryComponent,
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    GatheringCentersComponent,
    UsersComponent,
    ClasificationComponent,
    SeparationComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
