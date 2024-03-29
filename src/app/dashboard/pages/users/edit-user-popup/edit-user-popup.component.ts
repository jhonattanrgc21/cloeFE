import { EmployePosition } from './../../../interfaces/employe-position.interface';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City } from 'src/app/landing/interfaces/cities.interface';
import { State } from 'src/app/landing/interfaces/states.interface';
import { GenerarlService } from 'src/app/shared/services/generarl.service';

@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.scss']
})
export class EditUserPopupComponent {
	title: string = '';
	userForm!: FormGroup;

	employePositions: EmployePosition[] = [
		{
			id: 1,
			name: 'administrador'
		},
		{
			id: 2,
			name: 'Clasificador'
		},
		{
			id: 3,
			name: 'Separador'
		}
	];

	states: State[] = [
		{
			id: 1,
			name: 'Distrito capital',
		},
		{
			id: 2,
			name: 'Carabobo',
		},
		{
			id: 3,
			name: 'Aragua',
		},
		{
			id: 4,
			name: 'Miranda',
		},
		{
			id: 5,
			name: 'Lara',
		},
		{
			id: 6,
			name: 'Mérida',
		},
	];

	cities: City[] = [
		{
			id: 1,
			name: 'Valencia',
			parentStateId: 2,
		},
		{
			id: 2,
			name: 'Guacara',
			parentStateId: 4,
		},
		{
			id: 3,
			name: 'Los Guayos',
			parentStateId: 2,
		},
		{
			id: 4,
			name: 'Bejuma',
			parentStateId: 5,
		},
		{
			id: 5,
			name: 'Caracas',
			parentStateId: 1,
		},
	];

	constructor(
		public dialogRef: MatDialogRef<EditUserPopupComponent>,
		private _fb: FormBuilder,
		private _generalService: GenerarlService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.title = data?.id ? 'Editar usuario': 'Registrar usuario';
    this.userForm = this._fb.group({
			id: [data?.id],
			firstName: [data?.firstName, [Validators.required, this._generalService.noWhitespaceValidator()]],
			lastName: [data?.lastName, [Validators.required, this._generalService.noWhitespaceValidator()]],
			email: [data?.email, [Validators.required, this._generalService.noWhitespaceValidator()]],
			documentType: [data?.identification.split('-')[0], Validators.required],
			identification: [data?.identification.split('-')[1], [Validators.required, this._generalService.noWhitespaceValidator()]],
			employePosition: [data?.employePosition.id, Validators.required],
			state: [data?.state.id, Validators.required],
			city: [data?.city.id, Validators.required],
			address: [data?.address, [Validators.required, this._generalService.noWhitespaceValidator()]],
		});

	}

	onClose(gatheringCenter?: any): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveUser(){
		const form = this.userForm.value;
		const stateObj = this.states.find(state => state.id == form.state);
		const cityObj = this.cities.find(city => city.id == form.city);
		const employePositionObj = this.employePositions.find(employePosition => employePosition.id == form.employePosition);

		if (stateObj && cityObj && employePositionObj) {
			const user: any = {
				id: form.id,
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
				email: form.email.trim(),
				identification: form.documentType + '-' + form.identification.trin(),
				address: form.address.trim(),
				state: stateObj,
				city: cityObj,
				employePosition: employePositionObj
			};
			this.onClose(user);
		}
	}
}
