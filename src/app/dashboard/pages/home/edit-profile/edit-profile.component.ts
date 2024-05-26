import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { UserSession } from 'src/app/auth/interfaces/current-user.interface';
import { UserEdit } from 'src/app/dashboard/interfaces/users.interface';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
	user!: UserSession | null | undefined;

	private readonly _destroyed$ = new Subject<void>();

	title: string = '';
	state?: number;
	city?: number;
	address?: string;
	userForm!: FormGroup;
	statesList: SelectionInput[] = [];
	citiesList: SelectionInput[] = [];

	constructor(
		public dialogRef: MatDialogRef<EditProfileComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.title = this.data?.title;
		this.user = this.data?.user;
		this.statesList = this.data.statesList;

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
			state: [, Validators.required],
			city: [, Validators.required],
			address: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
		});

		this.userForm.get('state')?.valueChanges.subscribe((stateId) => {
			this.userForm.get('city')?.reset();
			const stateSelectionFilter: SelectFilter = {
				filters: { estado_id: stateId },
			};
			this._generalService.getCities(stateSelectionFilter).subscribe((res) => {
				if (res.success) {
					this.citiesList = res.data;
					this.city = this.citiesList.find(
						(item) => item.id == this.user?.ciudad
					)?.id;
					this.userForm.get('city')?.setValue(this.city);
				} else this.citiesList = [];
			});
		});
	}

	ngOnInit(): void {
		this.userForm.patchValue({
			id: this.user?.user_id,
			firstName: this.user?.name,
			lastName: this.user?.lastname,
			address: this.user?.address,
			state: this.user?.estado,
		});
	}

	onClose(gatheringCenter?: any): void {
		this.dialogRef.close(gatheringCenter);
	}

	onSaveUser() {
		const form = this.userForm.value;
		const stateObj = this.statesList.find((state) => state.id == form.state);
		const cityObj = this.citiesList.find((city) => city.id == form.city);
		if (stateObj && cityObj) {
			const user: UserEdit = {
				id: form.id,
				name: form.firstName.trim(),
				lastname: form.lastName.trim(),
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
