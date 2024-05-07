import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/core/constants/constants';
import { GenerarlService } from 'src/app/shared/services/generarl.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
	token: string = '';
	form: FormGroup;
	isSavePassword = false;

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _generalService: GenerarlService
	) {
		this.form = this._fb.group({
			password: [, [Validators.required, Validators.minLength(8), this._generalService.noWhitespaceValidator()]],
			confirmPassword: [, [Validators.required, Validators.minLength(8), this._generalService.noWhitespaceValidator()]],
		});
	}

	savePassword() {
		const changePassword = this.form.value;
		changePassword.password = changePassword.password.trim();
		changePassword.confirmPassword = changePassword.confirmPassword.trim();
		this.isSavePassword = true;
	}

	redirecToLogin(){
		this._router.navigateByUrl(ROUTES.login);
	}
}
