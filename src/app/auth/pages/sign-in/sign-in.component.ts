import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/core/constants/constants';
import { GenerarlService } from 'src/app/shared/services/generarl.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
	loginForm: FormGroup;

	constructor(private _fb: FormBuilder, private _router: Router, private _generalServices: GenerarlService) {
		this.loginForm = this._fb.group({
			username: [, [Validators.required, this._generalServices.noWhitespaceValidator()]],
			password: [, [Validators.required, Validators.minLength(8), this._generalServices.noWhitespaceValidator()]],
		});
	}

	login(): void{
		let input = this.loginForm.value;
		input.username = input.username.trim();
		input.password = input.password.trim();
		this._router.navigateByUrl(ROUTES.summary);
	}

	isNotValid(field: string): boolean {
		return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
	}
}
