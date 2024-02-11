import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/core/constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
	token: string = '';
	form: FormGroup;
	isSavePassword = true;

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
	) {
		this.form = this._fb.group({
			password: [, [Validators.required, Validators.minLength(8)]],
			confirmPassword: [, [Validators.required, Validators.minLength(8)]],
		});
	}

	savePassword() {
		const changePassword = this.form.value;
		this.isSavePassword = true;
	}

	redirecToLogin(){
		this._router.navigateByUrl(ROUTES.login);
	}
}
