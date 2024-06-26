import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES, emailPattern } from 'src/app/core/constants';
import { GenerarlService } from 'src/app/shared/services/generarl.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	landingForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private _router: Router,
		private elementRef: ElementRef,
		private _generalService: GenerarlService
	) {
		this.landingForm = this.fb.group({
			name: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			phone: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			email: [
				,
				[
					Validators.required,
					Validators.email,
					Validators.pattern(emailPattern),
				],
			],
			city: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			message: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
		});
	}

	goToGatheringCenter() {
		this._router.navigateByUrl(ROUTES.landingGatheringCenter);
	}

	scrollToSection(sectionId: string) {
		const section = this.elementRef.nativeElement.querySelector(sectionId);
		section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	sendMessage() {
		let input = this.landingForm.value;
		input.name = input.name.trim();
		input.phone = input.phone.trim();
		input.email = input.email.trim();
		input.city = input.city.trim();
		input.message = input.message.trim();
	}
}
