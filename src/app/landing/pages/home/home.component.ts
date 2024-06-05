import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTES, emailPattern } from 'src/app/core/constants/constants';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SendMessage } from '../../interfaces/contacts.interface';
import { ReceivedMessageComponent } from './received-message/received-message.component';
import { LandingService } from '../../services/landing.service';
import { ErrorPopupComponent } from 'src/app/shared/components/error-popup/error-popup.component';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	landingForm: FormGroup;
	dialogWidth: string = '380px';
	dialogHeight: string = 'auto';
	state?: number;
	city?: number;
	statesList: SelectionInput[] = [];
	citiesList: SelectionInput[] = [];
	siteKey: string = '';

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _elementRef: ElementRef,
		private _generalService: GeneralService,
		private _dialog: MatDialog,
		private _landingService: LandingService,
	) {
		this.landingForm = this._fb.group({
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
			state: [, Validators.required],
			city: [, Validators.required],
			message: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			recaptcha: ['', Validators.required]
		});

		this.landingForm.get('state')?.valueChanges.subscribe((stateId) => {
			this.landingForm.get('city')?.reset();
			const stateSelectionFilter: SelectFilter = {
				filters: { estado_id: stateId },
			};
			this._generalService.getCities(stateSelectionFilter).subscribe((res) => {
				if (res.success) {
					this.citiesList = res.data;
				} else this.citiesList = [];
			});
		});
	}
	ngOnInit(): void {
		this.siteKey = environment.siteKey;
		this._generalService.getStates().subscribe((res) => {
			this.statesList = res.success ? res.data : [];
		});
	}

	resolved(captchaResponse: any) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

	goToGatheringCenter() {
		this._router.navigateByUrl(ROUTES.landingGatheringCenter);
	}

	scrollToSection(sectionId: string) {
		const section = this._elementRef.nativeElement.querySelector(sectionId);
		section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	openDialog (component: any, data?: any) {
		return this._dialog.open(component, {
			width: this.dialogWidth,
			height: this.dialogHeight,
			autoFocus: false,
			data,
		});
	};

	sendMessage() {
		const initialTitle = 'Enviar mensaje';
		const initialSubtitle = '¿Seguro de que desea enviar este mensaje?';
		const successSubtitle = 'Mensaje recibido, lo(a) contactaremos en la brevedad posible.';
		const errorTitle = 'Ocurrió un error';
		const errorSubtitle = 'Algo salió mal, intente nuevamente.';

		const dialogRef = this.openDialog(ConfirmationPopupComponent, {
			icon: '../../../../assets/svg/send.svg',
			title: initialTitle,
			subtitle: initialSubtitle,
			type: 'edit',
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				let input = this.landingForm.value;
				const cityId = this.citiesList.find(item => item.id == input.city)?.id;
				const stateId = this.statesList.find(item => item.id == input.state)?.id;
				const inputMessage: SendMessage = {
					name: input.name.trim(),
					phone: input.phone.trim(),
					email: input.email.trim(),
					ciudad_id: cityId!,
					estado_id: stateId!,
					message: input.message.trim(),
				};

				this._landingService.sendMessage(inputMessage).subscribe((res) => {
					if (res.success) {
						const dialogSendMessage = this.openDialog(ReceivedMessageComponent, {
							icon: '../../../../assets/svg/markunread_mailbox.svg',
							subtitle: successSubtitle,
						});

						dialogSendMessage.afterClosed().subscribe((result) => {
							if (result) this.landingForm.reset();
						});
					} else {
						const dialogSendMessage = this.openDialog(ErrorPopupComponent, {
							icon: '../../../../assets/svg/cancel_schedule_send.svg',
							title: errorTitle,
							subtitle: errorSubtitle,
						});
					}
				});
			}
		});
	}

}
