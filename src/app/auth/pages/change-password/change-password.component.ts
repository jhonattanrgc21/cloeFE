import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerarlService } from 'src/app/shared/services/generarl.service';
import { ROUTES } from 'src/app/core/constants/constants';
import { ResetPassword } from '../../interfaces/reset-password.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
	token: string = '';
	form: FormGroup;
	isSavePassword = false;
	isErrorSave = false;
	message: string = '';

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _generalService: GenerarlService,
		private _authService: AuthService
	) {
		this.form = this._fb.group({
			password: [, [Validators.required, Validators.minLength(8), this._generalService.noWhitespaceValidator()]],
			confirmPassword: [, [Validators.required, Validators.minLength(8), this._generalService.noWhitespaceValidator()]],
		});
	}

	ngOnInit(): void {
		this.token = this._activatedRoute.snapshot.params['token'];
	}

	savePassword() {
		const resetPassword: ResetPassword = {
			password: this.form.value.password.trim(),
			confirm_password: this.form.value.confirmPassword.trim()
		}

		this._authService.resetPassword(this.token, resetPassword).subscribe(res =>{
			if(res.success){
				this.isSavePassword = true;
				this.isErrorSave = false;
			}
			else{
				this.isSavePassword = false;
				this.isErrorSave = true;
			}
			this.message = res.message;;
		})
	}



	redirecToLogin(){
		this._router.navigateByUrl(ROUTES.login);
	}
}
