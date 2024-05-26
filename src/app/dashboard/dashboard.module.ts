import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { GatheringCentersComponent } from './pages/gathering-centers/gathering-centers.component';
import { UsersComponent } from './pages/users/users.component';
import { ClasificationComponent } from './pages/clasification/clasification.component';
import { SeparationComponent } from './pages/separation/separation.component';
import { NewGatheringCentersPopupComponent } from './pages/gathering-centers/new-gathering-centers-popup/new-gathering-centers-popup.component';
import { EditUserPopupComponent } from './pages/users/edit-user-popup/edit-user-popup.component';
import { EditClasificationComponent } from './pages/clasification/edit-clasification/edit-clasification.component';
import { ClasificationDetailComponent } from './pages/clasification/clasification-detail/clasification-detail.component';
import { ClasificationTableComponent } from './pages/separation/clasification-table/clasification-table.component';
import { UserDetailPopupComponent } from './pages/users/user-detail-popup/user-detail-popup.component';
import { ComponentEditComponent } from './pages/separation/component-edit/component-edit.component';
import { ViewComponentComponent } from './pages/separation/view-component/view-component.component';
import { HomeComponent } from './pages/home/home.component';
import { EditProfileComponent } from './pages/home/edit-profile/edit-profile.component';
import { EditPasswordComponent } from './pages/home/edit-password/edit-password.component';


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
    ClasificationTableComponent,
    UserDetailPopupComponent,
    ComponentEditComponent,
    ViewComponentComponent,
    HomeComponent,
    EditProfileComponent,
    EditPasswordComponent,
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
