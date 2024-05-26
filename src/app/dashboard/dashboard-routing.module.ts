import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { GatheringCentersComponent } from './pages/gathering-centers/gathering-centers.component';
import { UsersComponent } from './pages/users/users.component';
import { ClasificationComponent } from './pages/clasification/clasification.component';
import { SeparationComponent } from './pages/separation/separation.component';
import { RoleGuard } from '../core/guards/role.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home',
	},
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: 'home',
				component: HomeComponent,
			},
			{
				path: 'summary',
				component: SummaryComponent,
				canActivate: [RoleGuard],
				data: { expectedRoles: ['admin'] }
			},
			{
				path: 'gathering-centers',
				component: GatheringCentersComponent,
				canActivate: [RoleGuard],
				data: { expectedRoles: ['admin'] }
			},
			{
				path: 'users',
				component: UsersComponent,
				canActivate: [RoleGuard],
				data: { expectedRoles: ['admin'] }
			},
			{
				path: 'clasification',
				component: ClasificationComponent,
				canActivate: [RoleGuard],
				data: { expectedRoles: ['admin', 'encargado', 'clasificador'] }
			},
			{
				path: 'separation',
				component: SeparationComponent,
				canActivate: [RoleGuard],
				data: { expectedRoles: ['admin', 'encargado', 'separador'] }
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
