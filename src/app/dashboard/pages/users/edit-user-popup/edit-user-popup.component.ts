import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployePosition } from './../../../interfaces/employe-position.interface';
import { GeneralService } from 'src/app/shared/services/general.service';
import { User, UserEdit } from 'src/app/dashboard/interfaces/users.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
	selector: 'app-edit-user-popup',
	templateUrl: './edit-user-popup.component.html',
	styleUrls: ['./edit-user-popup.component.scss'],
})
export class EditUserPopupComponent implements OnInit, OnDestroy {
	private readonly _destroyed$ = new Subject<void>();

	title: string = '';
	state?: number;
	city?: number;
	address?: string;
	userForm!: FormGroup;

	employePositions: EmployePosition[] = [
		{
			id: 1,
			name: 'Administrador',
		},
		{
			id: 2,
			name: 'Clasificador',
		},
		{
			id: 3,
			name: 'Separador',
		},
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
		this.userForm = this._fb.group({
			id: [],
			firstName: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			lastName: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			email: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			documentType: [, Validators.required],
			identification: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			employePosition: [, Validators.required],
			state: [, Validators.required],
			city: [, Validators.required],
			address: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
		});

		this.statesList = this.data.statesList;
		this.userForm
			.get('state')
			?.valueChanges.pipe(
				takeUntil(this._destroyed$),
				switchMap((stateId) => {
					this.userForm.get('city')?.reset();
					const stateSelectionFilter: SelectFilter = {
						filters: { estado_id: stateId },
					};
					return this._generalService.getCities(stateSelectionFilter);
				})
			)
			.subscribe((res) => {
				this.citiesList = res.success ? res.data : [];
				if (this.data.user) {
					const user: User = this.data.user;
					this.city = this.citiesList.find(
						(item) => item.name.toLowerCase() === user.municipio.toLowerCase()
					)?.id;
					this.userForm.get('city')?.setValue(this.city);
				}
			});
	}

	ngOnInit(): void {
		const user: User = this.data.user;
    if (!user) {
      this.title = 'Registrar usuario';
    } else {
      this.title = 'Editar usuario';
      this.userForm.patchValue({
        id: user.id,
        firstName: user.name,
        lastName: user.lastname,
        email: user.email,
        documentType: user.cedula_type,
        identification: user.cedula_number,
        employePosition: user.role,
        address: user.address
      });
      this.state = this.statesList.find(item => item.name.toLowerCase() === user.estado.toLowerCase())?.id;
      this.userForm.get('state')?.setValue(this.state);
    }
	}

	onClose(gatheringCenter?: any): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveUser() {
		const form = this.userForm.value;
		const stateObj = this.statesList.find((state) => state.id == form.state);
		const cityObj = this.citiesList.find((city) => city.id == form.city);
		const employePositionObj = this.employePositions.find(
			(employePosition) => employePosition.id == form.employePosition
		);

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

	ngOnDestroy(): void {
		this._destroyed$.next();
		this._destroyed$.complete();
	}
}
