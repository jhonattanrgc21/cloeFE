import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'Sistema Cloe';

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit(): void {
	}

}
