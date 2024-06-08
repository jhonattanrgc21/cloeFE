import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserSession } from 'src/app/auth/interfaces/current-user.interface';
import { ResetPassword } from 'src/app/auth/interfaces/reset-password.interface';
import { UserEdit } from 'src/app/dashboard/interfaces/users.interface';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
	selector: 'app-edit-password',
	templateUrl: './edit-password.component.html',
	styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent {
	form!: FormGroup;
	title: string = '';
	user!: UserSession | null | undefined;

	constructor(
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		public dialogRef: MatDialogRef<EditPasswordComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.user = this.data?.user;
		this.title = this.data?.title;
		this.form = this._fb.group({
			old_password: [
				,
				[
					Validators.required,
					Validators.minLength(8),
					this._generalService.noWhitespaceValidator(),
				],
			],
			password: [
				,
				[
					Validators.required,
					Validators.minLength(8),
					this._generalService.noWhitespaceValidator(),
				],
			],
			confirmPassword: [
				,
				[
					Validators.required,
					Validators.minLength(8),
					this._generalService.noWhitespaceValidator(),
				],
			],
		}, { validator: this.passwordsMatchValidator });
	}

	passwordsMatchValidator(control: AbstractControl) {
		const password = control.get('password')?.value;
		const confirmPassword = control.get('confirmPassword')?.value;
		if (password !== confirmPassword) {
			control.get('confirmPassword')?.setErrors({ passwordsNotMatch: true });
		}
	}

	onSave() {
		const userEdit: UserEdit  = {
			id: this.user?.user_id,
			old_password: this.form.value.old_password.trim(),
			password: this.form.value.password.trim(),
			confirm_password: this.form.value.confirmPassword.trim(),
		};

		this.onClose(userEdit);
	}

	onClose(resetPassword?: any): void {
		this.dialogRef.close(resetPassword);
	}
}
