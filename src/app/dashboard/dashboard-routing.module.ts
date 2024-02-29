import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './pages/summary/summary.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: 'summary',
				component: SummaryComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
