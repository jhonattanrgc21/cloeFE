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


@NgModule({
  declarations: [
    LandingComponent,
    LandingHeaderComponent,
    LandingFooterComponent,
    HomeComponent,
    CloeAdvantagesComponent
  ],
  imports: [
    CommonModule,
		ReactiveFormsModule,
    LandingRoutingModule,
		SharedModule,
  ]
})
export class LandingModule { }
