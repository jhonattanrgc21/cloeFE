import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Manager, GatheringCenter } from './../../../interfaces/gathering-center.interface';
import { City } from 'src/app/landing/interfaces/cities.interface';
import { State } from 'src/app/landing/interfaces/states.interface';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
	selector: 'app-new-gathering-centers-popup',
	templateUrl: './new-gathering-centers-popup.component.html',
	styleUrls: ['./new-gathering-centers-popup.component.scss'],
})
export class NewGatheringCentersPopupComponent {
	title: string = '';
	gatheringCenterForm!: FormGroup;
	managers: Manager[] = [
		{
			id: 1,
			name: 'Jhonattan Garcia',
		},
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
		public dialogRef: MatDialogRef<NewGatheringCentersPopupComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: GatheringCenter
	) {
		this.title = data?.id ? 'Editar centro de acopio': 'Registrar centro de acopio';
    this.gatheringCenterForm = this._fb.group({
			id: [data?.id],
			manager: [data?.manager.id, Validators.required],
			description: [data?.description, [Validators.required, this._generalService.noWhitespaceValidator()]],
			state: [data?.state.id, Validators.required],
			city: [data?.city.id, Validators.required],
			address: [data?.address, [Validators.required, this._generalService.noWhitespaceValidator()]],
		});

	}

	onClose(gatheringCenter?: GatheringCenter): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveGatheringCenter(){
		const form = this.gatheringCenterForm.value;
		const managerObj = this.managers.find(manager => manager.id == form.manager);
		const stateObj = this.states.find(state => state.id == form.state);
		const cityObj = this.cities.find(city => city.id == form.city);
		const status: string = this.data? this.data.status: 'Activo';

		if (managerObj && stateObj && cityObj) {
			const gatheringCenter: GatheringCenter = {
				id: form.id,
				address: form.address.trim(),
				description: form.description.trim(),
				manager: managerObj,
				state: stateObj,
				city: cityObj,
				status
			};
			this.onClose(gatheringCenter);
		}
	}
}
