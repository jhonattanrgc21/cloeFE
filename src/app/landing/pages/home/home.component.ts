import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	landingForm: FormGroup;

	constructor(private fb: FormBuilder, private router: Router){
		this.landingForm = this.fb.group({
			name: [, Validators.required],
			phone: [, Validators.required],
			email: [, [Validators.required, Validators.email]],
			city: [, Validators.required],
			message: [, Validators.required],
		});
	}
}
