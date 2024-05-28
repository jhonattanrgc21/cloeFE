import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GatheringCenter, GatheringCenterUpdate } from './../../../interfaces/gathering-center.interface';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';

@Component({
	selector: 'app-new-gathering-centers-popup',
	templateUrl: './new-gathering-centers-popup.component.html',
	styleUrls: ['./new-gathering-centers-popup.component.scss'],
})
export class NewGatheringCentersPopupComponent implements OnInit, OnDestroy {
	private readonly _destroyed$ = new Subject<void>();

	title: string = '';
	gatheringCenterForm!: FormGroup;
	managerList: SelectionInput[] = [];
	statesList: SelectionInput[] = [];
	citiesList: SelectionInput[] = [];
	manager?: number;
	state?: number;
	city?: number;

	constructor(
		public dialogRef: MatDialogRef<NewGatheringCentersPopupComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.statesList = this.data.statesList;
		this.managerList = this.data.managerList;
		this.gatheringCenterForm = this._fb.group({
			centro_id: [],
			name: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			description: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			encargado_id: [, Validators.required],
			estado_id: [, Validators.required],
			ciudad_id: [, Validators.required],
			address: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
		});

		this.gatheringCenterForm
			.get('estado_id')
			?.valueChanges.pipe(
				takeUntil(this._destroyed$),
				switchMap((stateId) => {
					this.gatheringCenterForm.get('ciudad_id')?.reset();
					const stateSelectionFilter: SelectFilter = {
						filters: { estado_id: stateId },
					};
					return this._generalService.getCities(stateSelectionFilter).pipe(
						tap((res) => {
							this.citiesList = res.success ? res.data : [];
							if (this.data.center) {
								const center: GatheringCenter = this.data.center;
								this.city = this.citiesList.find(
									(item) =>
										item.name.toLowerCase() === center.ciudad.toLowerCase()
								)?.id;
								this.gatheringCenterForm.get('ciudad_id')?.setValue(this.city);
							}
						})
					);
				})
			)
			.subscribe();
	}

	ngOnInit(): void {
		const center: GatheringCenter = this.data.center;
		if (!center) this.title = 'Registrar centro de acopio';
		else {
			this.title = 'Editar centro de acopio';
			this.gatheringCenterForm.patchValue({
				centro_id: center.centro_id,
				name: center.name,
				description: center.description,
				encargado_id: center.encargado.user_id,
				address: center.address,
			});
			this.state = this.statesList.find(
				(item) => item.name.toLowerCase() === center.estado.toLowerCase()
			)?.id;
			this.gatheringCenterForm.get('estado_id')?.setValue(this.state);
		}
	}

	onClose(gatheringCenter?: GatheringCenterUpdate): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveGatheringCenter() {
		const form: GatheringCenterUpdate = this.gatheringCenterForm.value;
		this.onClose(form);
	}

	ngOnDestroy(): void {
		this._destroyed$.next();
		this._destroyed$.complete();
	}
}
