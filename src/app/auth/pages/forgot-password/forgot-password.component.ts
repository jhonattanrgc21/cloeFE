import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailPattern } from 'src/app/core/constants/constants';
import { AuthService } from '../../services/auth.service';

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
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService
	) {
		this.form = this.fb.group({
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
		this.authService.forgotPassword(json).subscribe((res) => {
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
