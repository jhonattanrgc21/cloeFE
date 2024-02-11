import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
	loginForm: FormGroup;

	constructor(private fb: FormBuilder, private router: Router) {
		this.loginForm = this.fb.group({
			username: [, [Validators.required]],
			password: [, [Validators.required, Validators.minLength(4)]],
		});
	}

	isNotValid(field: string): boolean {
		return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
	}
}
