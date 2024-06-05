import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/shared/services/general.service';
import { User, UserEdit } from 'src/app/dashboard/interfaces/users.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { GatheringCenterCard } from 'src/app/landing/interfaces/gathering-center.interface';

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
	center?: number;
	address?: string;
	userForm!: FormGroup;
	isViewGatheringCenterInput?: boolean = true;
	rolesList: string[] = [];
	statesList: SelectionInput[] = [];
	citiesList: SelectionInput[] = [];
	centersList: SelectionInput[] = [];

	constructor(
		public dialogRef: MatDialogRef<EditUserPopupComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.statesList = this.data.statesList;
		this.rolesList = this.data.rolesList;
		this.centersList = this.data.centersList;

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
			gatheringCenter: [, Validators.required],
		});

		this.userForm
		.get('employePosition')
			?.valueChanges.subscribe(roleName => {
				if(roleName.toLowerCase() == 'admin'){
					this.isViewGatheringCenterInput = false;
					this.userForm.get('gatheringCenter')?.clearValidators();
					this.userForm.get('gatheringCenter')?.reset();
				}else{
					this.userForm.get('gatheringCenter')?.setValidators(Validators.required);
					this.isViewGatheringCenterInput = true;
				}
			})

		this.userForm
			.get('state')
			?.valueChanges.pipe(
				takeUntil(this._destroyed$),
				switchMap((stateId) => {
					this.userForm.get('city')?.reset();
					const stateSelectionFilter: SelectFilter = {
						filters: { estado_id: stateId },
					};
					return this._generalService.getCities(stateSelectionFilter).pipe(
						switchMap((res) => {
							this.citiesList = res.success ? res.data : [];
							if (this.data.user) {
								const user: User = this.data.user;
								this.city = this.citiesList.find(
									(item) =>
										item.name.toLowerCase() === user.ciudad.toLowerCase()
								)?.id;
								this.userForm.get('city')?.setValue(this.city);
							}
							return this._generalService.getGatheringCenters(
								stateSelectionFilter
							);
						})
					);
				})
			)
			.subscribe((res) => {
				this.userForm.get('gatheringCenter')?.reset();
				if (!res.success) this.centersList = [];
				else {
					const centers: GatheringCenterCard[] = res.data;
					this.centersList = [];
					centers.forEach((center) => {
						this.centersList.push({ id: center.centro_id, name: center.name });
					});

					if (this.data.user) {
						const user: User = this.data.user;
						this.center = this.centersList.find(
							(item) =>
								item.id === user.centro_id
						)?.id;
						this.userForm.get('gatheringCenter')?.setValue(this.center);
					}
				}
			});

		this.userForm
			.get('city')
			?.valueChanges.pipe(
				takeUntil(this._destroyed$),
				switchMap((cityId) => {
					const stateId = this.userForm.get('state')?.value;
					const centersFilter: SelectFilter = {
						filters: { estado_id: stateId, ciudad_id: cityId },
					};
					return this._generalService.getGatheringCenters(centersFilter);
				})
			)
			.subscribe((res) => {
				this.userForm.get('gatheringCenter')?.reset();
				if (!res.success) this.centersList = [];
				else {
					const centers: GatheringCenterCard[] = res.data;
					this.centersList = [];
					centers.forEach((center) => {
						this.centersList.push({ id: center.centro_id, name: center.name });
					});
				}
			});
	}

	ngOnInit(): void {
		const user: User = this.data.user;
		if (!user) {
			this.title = 'Registrar usuario';
		} else {
			this.title = 'Editar usuario';
			this.state = this.statesList.find(
				(item) => item.name.toLowerCase() === user.estado.toLowerCase()
			)?.id;
			this.userForm.get('state')?.setValue(this.state);
			this.userForm.patchValue({
				id: user.id,
				firstName: user.name,
				lastName: user.lastname,
				email: user.email,
				documentType: user.cedula_type,
				identification: user.cedula_number,
				employePosition: user.role,
				address: user.address,
			});
		}
	}

	onClose(gatheringCenter?: any): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveUser() {
		const form = this.userForm.value;
		const stateObj = this.statesList.find((state) => state.id == form.state);
		const cityObj = this.citiesList.find((city) => city.id == form.city);
		const center = this.centersList.find(
			(center) => center.id == form.gatheringCenter
		);
		const role = this.rolesList.find(
			(role) => role.toLowerCase() == form.employePosition.toLowerCase()
		);

		if (stateObj && cityObj && role) {
			const user: UserEdit = {
				id: form.id,
				name: form.firstName.trim(),
				lastname: form.lastName.trim(),
				email: form.email.trim(),
				role,
				ci_type: form.documentType,
				ci_number: form.identification.trim(),
				centro_id: center?.id,
				address: form.address.trim(),
				estado_id: stateObj.id,
				ciudad_id: cityObj.id,
			};
			this.onClose(user);
		}
	}

	ngOnDestroy(): void {
		this._destroyed$.next();
		this._destroyed$.complete();
	}
}
