import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: 'sign-in',
				component: SignInComponent,
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			},
			{
				path: 'change-password/:token',
				component: ChangePasswordComponent,
			},
			{
				path: '**',
				redirectTo: 'login',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
