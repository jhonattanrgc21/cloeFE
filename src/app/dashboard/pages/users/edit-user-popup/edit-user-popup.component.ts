import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployePosition } from './../../../interfaces/employe-position.interface';
import { City } from 'src/app/landing/interfaces/cities.interface';
import { State } from 'src/app/landing/interfaces/states.interface';
import { GenerarlService } from 'src/app/shared/services/generarl.service';
import { UserEdit } from 'src/app/dashboard/interfaces/users.interface';

@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.scss']
})
export class EditUserPopupComponent {
	title: string = '';
	state?: number;
	city?: number;
	address?: number;

	userForm!: FormGroup;

	employePositions: EmployePosition[] = [
		{
			id: 1,
			name: 'Administrador'
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
		if(!data.id) this.title = 'Registrar usuario';
		else{
			this.title = 'Editar usuario';
			this.state = this.states.find(item => item.name.toLowerCase() ==  data.estado.toLowerCase())?.id;
			this.city = this.cities.find(item => item.name.toLowerCase() ==  data.municipio.toLowerCase())?.id;
			this.address = data.address;
		}

    	this.userForm = this._fb.group({
			id: [data?.id],
			firstName: [data?.name, [Validators.required, this._generalService.noWhitespaceValidator()]],
			lastName: [data?.lastname, [Validators.required, this._generalService.noWhitespaceValidator()]],
			email: [data?.email, [Validators.required, this._generalService.noWhitespaceValidator()]],
			documentType: [data?.cedula_type, Validators.required],
			identification: [data?.cedula_number, [Validators.required, this._generalService.noWhitespaceValidator()]],
			employePosition: [data?.role, Validators.required],
			state: [this.state, Validators.required],
			city: [this.city, Validators.required],
			address: [this.address, [Validators.required, this._generalService.noWhitespaceValidator()]],
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
			const user: UserEdit = {
				id: form.id,
				name: form.firstName.trim(),
				lastname: form.lastName.trim(),
				email: form.email.trim(),
				role: employePositionObj.name,
				ci_type: form.documentType,
				ci_number: form.identification.trim(),
				address: form.address.trim(),
				estado_id: stateObj.id,
				municipio_id: cityObj.id,
			};
			this.onClose(user);
		}
	}
}
