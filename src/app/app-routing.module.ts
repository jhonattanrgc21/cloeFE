import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
	{ path: '', redirectTo: '/landing/home', pathMatch: 'full' },
	{
		path: 'landing',
		loadChildren: () =>
			import('./landing/landing.module').then((m) => m.LandingModule),
	},
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
	},
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
		canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
	},
	{
		path: '**',
		redirectTo: 'landing',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
