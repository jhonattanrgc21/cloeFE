import { ViewportRuler } from '@angular/cdk/scrolling';
import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTES, emailPattern } from 'src/app/core/constants/constants';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SendMessage } from '../../interfaces/contacts.interface';
import { ReceivedMessageComponent } from './received-message/received-message.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	landingForm: FormGroup;

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _elementRef: ElementRef,
		private _generalService: GeneralService,
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler
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
		const section = this._elementRef.nativeElement.querySelector(sectionId);
		section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	sendMessage() {
		const title = 'Enviar Mensaje';
		let subtitle = '¿Seguro de que desea enviar este mensaje';

		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: '../../../../assets/svg/icono_sobre_48x48.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				let input = this.landingForm.value;
				const inputMessage: SendMessage = {
					name: input.name.trim(),
					phone: input.phone.trim(),
					email: input.email.trim(),
					city: input.city.trim(),
					message: input.message.trim(),
				};

				// TODO: agregar peticion para enviar el correo
				subtitle = 'Mensaje recibido, lo(a) contactaremos en la brevedad posible.';
				const dialogSendMessage = this._dialog.open(ReceivedMessageComponent, {
					width: '380px',
					height: 'auto',
					autoFocus: false,
					data: {
						icon: '../../../../assets/svg/mark_email_unread.svg',
						subtitle,
					},
				});
			}
		});
	}
}
