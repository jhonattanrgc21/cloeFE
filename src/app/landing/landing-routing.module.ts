import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

const routes: Routes = [
	{ path: '', component: LandingComponent },
	{
		path: 'gathering-center',
		loadChildren: () =>
			import('./pages/gathering-center/gathering-center.module').then(
				(m) => m.GatheringCenterModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LandingRoutingModule {}
