import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LandingHeaderComponent } from './components/landing-header/landing-header.component';
import { LandingFooterComponent } from './components/landing-footer/landing-footer.component';
import { HomeComponent } from './pages/home/home.component';
import { CloeAdvantagesComponent } from './components/cloe-advantages/cloe-advantages.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RaeeTypeCardComponent } from './components/raee-type-card/raee-type-card.component';
import { LocationCardComponent } from './components/location-card/location-card.component';
import { GatheringCenterComponent } from './pages/gathering-center/gathering-center.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    LandingComponent,
    LandingHeaderComponent,
    LandingFooterComponent,
    HomeComponent,
		GatheringCenterComponent,
    CloeAdvantagesComponent,
    RaeeTypeCardComponent,
    LocationCardComponent
  ],
  imports: [
    CommonModule,
		ReactiveFormsModule,
    LandingRoutingModule,
		SharedModule,
		MaterialModule
  ]
})
export class LandingModule { }
