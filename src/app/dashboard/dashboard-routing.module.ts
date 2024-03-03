import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { GatheringCentersComponent } from './pages/gathering-centers/gathering-centers.component';
import { UsersComponent } from './pages/users/users.component';
import { ClasificationComponent } from './pages/clasification/clasification.component';
import { SeparationComponent } from './pages/separation/separation.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: 'summary',
				component: SummaryComponent,
			},
			{
				path: 'gathering-centers',
				component: GatheringCentersComponent,
			},
			{
				path: 'users',
				component: UsersComponent,
			},
			{
				path: 'clasification',
				component: ClasificationComponent,
			},
			{
				path: 'separation',
				component: SeparationComponent,
			},
			{
				path: '**',
				redirectTo: 'summary',
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
