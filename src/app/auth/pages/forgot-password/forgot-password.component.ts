import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { emailPattern } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	form: FormGroup;
	isSentMessage = false;
	errorMessage: string = '';

	constructor(
		private _fb: FormBuilder,
		private _authService: AuthService
	) {
		this.form = this._fb.group({
			email: [
				,
				[
					Validators.required,
					Validators.email,
					Validators.pattern(emailPattern),
				],
			],
		});
	}

	isNotValid(field: string): boolean {
		return (
			this.form.controls[field].invalid && this.form.controls[field].touched
		);
	}

	sentMessage() {
		let json = this.form.value;
		json.email = json.email.trim();
		this._authService.forgotPassword(json).subscribe((res) => {
			if (res.success) {
				this.isSentMessage = true;
				this.errorMessage = '';
			} else {
				this.isSentMessage = false;
				this.errorMessage = res.message;
			}
		});
	}
}
