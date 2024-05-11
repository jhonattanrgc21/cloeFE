import { Login } from './../../interfaces/login.interfce';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/core/constants/constants';
import { GenerarlService } from 'src/app/shared/services/generarl.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnDestroy {
	loginForm: FormGroup;
	errorMessage: string = '';

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _generalServices: GenerarlService,
		private _authService: AuthService,
		private _alertService: AlertService
	) {
		this.loginForm = this._fb.group({
			username: [
				,
				[Validators.required, this._generalServices.noWhitespaceValidator()],
			],
			password: [
				,
				[
					Validators.required,
					Validators.minLength(8),
					this._generalServices.noWhitespaceValidator(),
				],
			],
		});
	}

	login(): void {
		let input: Login = {
			email_username: this.loginForm.value.username.trim(),
			password: this.loginForm.value.password.trim(),
		};


		this._authService.login(input).subscribe(res => {
			if(res.success){
				this.errorMessage = '';
				this._router.navigateByUrl(ROUTES.summary);
			}
			else this.errorMessage = res.message;
		});

	}

	isNotValid(field: string): boolean {
		return (
			this.loginForm.controls[field].invalid &&
			this.loginForm.controls[field].touched
		);
	}

	ngOnDestroy(): void {
		this._alertService.setAlert({ isActive: false, message: '' });
	}
}
