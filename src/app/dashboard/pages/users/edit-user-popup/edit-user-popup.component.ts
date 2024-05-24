import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployePosition } from './../../../interfaces/employe-position.interface';
import { GeneralService } from 'src/app/shared/services/general.service';
import { User, UserEdit } from 'src/app/dashboard/interfaces/users.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';

@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.scss']
})
export class EditUserPopupComponent implements OnInit {

	title: string = '';
	state?: number;
	city?: number;
	address?: string;
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

	statesList: SelectionInput[] = []; 
	citiesList: SelectionInput[] = [];
	centersList: SelectionInput[] = []; 

	constructor(
		public dialogRef: MatDialogRef<EditUserPopupComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this._generalService.getStates().subscribe(res => {
			if (res.success) this.statesList = res.data;
			else this.statesList = [];
		});
		
    	this.userForm = this._fb.group({
			id: [],
			firstName: [, [Validators.required, this._generalService.noWhitespaceValidator()]],
			lastName: [, [Validators.required, this._generalService.noWhitespaceValidator()]],
			email: [, [Validators.required, this._generalService.noWhitespaceValidator()]],
			documentType: [, Validators.required],
			identification: [, [Validators.required, this._generalService.noWhitespaceValidator()]],
			employePosition: [, Validators.required],
			state: [, Validators.required],
			city: [, Validators.required],
			address: [, [Validators.required, this._generalService.noWhitespaceValidator()]],
		});
		this.statesList = this.data.statesList;
		this.userForm.get('state')?.valueChanges.subscribe((stateId) => {
			this.userForm.get('city')?.reset();
			const stateSelectionFilter: SelectFilter = {
				filters: {estado_id: stateId}
			}
			this._generalService.getCities(stateSelectionFilter).subscribe(res => {
				if (res.success)
				{
					this.citiesList = res.data;
					if(data.user){
						const user: User = data.user
						this.city = this.citiesList.find(item => item.name.toLowerCase() ==  user.municipio.toLowerCase())?.id;
						this.userForm.get('city')?.setValue(this.city);
					}
				} 
				else this.citiesList  = [];
			}); 
		  });
	}

	ngOnInit(): void {
		const user: User = this.data.user;
		if(!user) this.title = 'Registrar usuario';
		else{
			this.title = 'Editar usuario';		
			this.userForm.get('id')?.setValue(user.id);
			this.userForm.get('firstName')?.setValue(user.name);
			this.userForm.get('lastName')?.setValue(user.lastname);
			this.userForm.get('email')?.setValue(user.email);
			this.userForm.get('documentType')?.setValue(user.cedula_type);
			this.userForm.get('identification')?.setValue(user.cedula_number);
			this.userForm.get('employePosition')?.setValue(user.role);
			this.state = this.statesList.find(item => item.name.toLowerCase() ==  user.estado.toLowerCase())?.id;
			this.userForm.get('state')?.setValue(this.state);
			this.address = user.address;
			this.userForm.get('address')?.setValue(this.address);
		}
	}

	onClose(gatheringCenter?: any): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveUser(){
		const form = this.userForm.value;
		const stateObj = this.statesList.find(state => state.id == form.state);
		const cityObj = this.citiesList.find(city => city.id == form.city);
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
