import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GatheringCenterComponent } from './gathering-center.component';

const routes: Routes = [{ path: '', component: GatheringCenterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatheringCenterRoutingModule { }
