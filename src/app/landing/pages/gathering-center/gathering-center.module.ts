import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GatheringCenterRoutingModule } from './gathering-center-routing.module';
import { GatheringCenterComponent } from './gathering-center.component';


@NgModule({
  declarations: [
    GatheringCenterComponent
  ],
  imports: [
    CommonModule,
    GatheringCenterRoutingModule
  ]
})
export class GatheringCenterModule { }
