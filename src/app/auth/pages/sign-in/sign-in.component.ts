import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/core/constants';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
	loginForm: FormGroup;

	constructor(private _fb: FormBuilder, private _router: Router) {
		this.loginForm = this._fb.group({
			username: [, [Validators.required, Validators.email]],
			password: [, [Validators.required, Validators.minLength(8)]],
		});
	}

	login(): void{
		console.log('paso por aqui');
		this._router.navigateByUrl(ROUTES.summary);
	}

	isNotValid(field: string): boolean {
		return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
	}
}
