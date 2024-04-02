import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailPattern } from 'src/app/core/constants';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	form: FormGroup;
	isSentMessage = false;

	constructor(private fb: FormBuilder, private router: Router) {
		this.form = this.fb.group({
			email: [, [Validators.required,Validators.email,Validators.pattern(emailPattern)]],
		});
	}

	isNotValid(field: string): boolean {
		return this.form.controls[field].invalid && this.form.controls[field].touched
	}

	sentMessage(){
		let input = this.form.value;
		input.email = input.email.trim();
		this.isSentMessage = true;
	}
}
