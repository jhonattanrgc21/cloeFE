import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { GatheringCenterComponent } from './pages/gathering-center/gathering-center.component';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
		children: [
			{
				path: 'gathering-center',
				component: GatheringCenterComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LandingRoutingModule {}
