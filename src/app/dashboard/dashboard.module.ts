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
import { MaterialModule } from '../material.module';
import { NewGatheringCentersPopupComponent } from './pages/gathering-centers/new-gathering-centers-popup/new-gathering-centers-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EditUserPopupComponent } from './pages/users/edit-user-popup/edit-user-popup.component';
import { EditClasificationComponent } from './pages/clasification/edit-clasification/edit-clasification.component';
import { ClasificationDetailComponent } from './pages/clasification/clasification-detail/clasification-detail.component';
@NgModule({
  declarations: [
    DashboardComponent,
    SummaryComponent,
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    GatheringCentersComponent,
    UsersComponent,
    ClasificationComponent,
    SeparationComponent,
    NewGatheringCentersPopupComponent,
    EditUserPopupComponent,
    EditClasificationComponent,
    ClasificationDetailComponent,
  ],
  imports: [
    CommonModule,
		ReactiveFormsModule,
    DashboardRoutingModule,
		MaterialModule,
		SharedModule
  ]
})
export class DashboardModule { }
