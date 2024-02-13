import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { GatheringCenterComponent } from './pages/gathering-center/gathering-center.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
		children: [
			{
				path: 'home',
				component: HomeComponent,
			},
			{
				path: 'gathering-center',
				component: GatheringCenterComponent,
			},
			{
				path: '**',
				redirectTo: 'home',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LandingRoutingModule {}
