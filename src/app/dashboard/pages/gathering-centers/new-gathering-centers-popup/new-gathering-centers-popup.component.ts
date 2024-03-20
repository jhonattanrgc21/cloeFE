import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GatheringCenter, Manager } from 'src/app/dashboard/interfaces/gathering-center.interface';
import { City } from 'src/app/landing/interfaces/cities.interface';
import { State } from 'src/app/landing/interfaces/states.interface';

@Component({
	selector: 'app-new-gathering-centers-popup',
	templateUrl: './new-gathering-centers-popup.component.html',
	styleUrls: ['./new-gathering-centers-popup.component.scss'],
})
export class NewGatheringCentersPopupComponent {
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
		@Inject(MAT_DIALOG_DATA) public data: GatheringCenter
	) {
    this.gatheringCenterForm = this._fb.group({
			id: [data?.id],
			manager: [data?.manager, Validators.required],
			description: [data?.description, Validators.required],
			state: [data?.state, Validators.required],
			city: [data?.city, Validators.required],
			address: [data?.address, Validators.required],
		});

	}

	onClose(gatheringCenter?: GatheringCenter): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveGatheringCenter(){
		const gatheringCenter: GatheringCenter = this.gatheringCenterForm.value;
		this.onClose(gatheringCenter);
	}
}
