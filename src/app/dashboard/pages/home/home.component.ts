import { ResetPassword } from './../../../auth/interfaces/reset-password.interface';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UsersService } from '../../services/users.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { UserSession } from 'src/app/auth/interfaces/current-user.interface';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { UserEdit } from '../../interfaces/users.interface';
import { EditPasswordComponent } from './edit-password/edit-password.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	statesList: SelectionInput[] = [];
	user!: UserSession | null | undefined;

	constructor(
		private _dialog: MatDialog,
		private _alertService: AlertService,
		private _authService: AuthService,
		private _usersServices: UsersService,
		private _generalService: GeneralService,
		private _viewportRuler: ViewportRuler
	) {}

	ngOnInit(): void {
		this._authService.getProfileInfo().subscribe((res) => {
			this.user = this._authService.currentUserSession;
		});
		this._generalService.getStates().subscribe((res) => {
			this.statesList = res.success ? res.data : [];
		});
	}

	getFullName() {
		return this._authService.currentFullName;
	}

	openDialogEditProfile(): void {
		const title = 'Editar Perfil';
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(EditProfileComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {
				title,
				user: this.user,
				statesList: this.statesList,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) this.openDialogConfirmationProfile(result);
		});
	}

	openDialogConfirmationProfile(userEdit: UserEdit): void {
		const title = 'Editar Perfil';
		const subtitle = '¿Seguro de que desea editar su perfil?';

		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: '../../../../../assets/svg/person_edit_verde.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._usersServices.updateUser(userEdit).subscribe((res) => {
					let isActive: boolean = true;
					let type: string = 'success';
					let message: string =
						'Excelente, el usuario se ha guardado con éxito.';
					if (!res.success) {
						message = res.message;
						type = 'error';
					}
					else{
						this.user!.name = userEdit.name as string;
						this.user!.lastname = userEdit.lastname as string;
						this.user!.estado = userEdit.estado_id as number;
						this.user!.ciudad = userEdit.ciudad_id as number;
						this.user!.address = userEdit.address as string;
						this._authService.setCurrentUser(this.user!);
					}
					this._alertService.setAlert({
						isActive,
						message,
						type,
					});
				});
			}
		});
	}

	openDialogEditPassword(): void {
		const title = 'Cambiar Contraseña';
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(EditPasswordComponent, {
			width: viewportSize.width < 768 ? '380px' : '400px',
			height: 'auto',
			autoFocus: false,
			data: {
				title,
				user: this.user,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) this.openDialogConfirmationPassword(result);
		});
	}

	openDialogConfirmationPassword(userEdit: UserEdit): void {
		const title = 'Cambiar Contraseña';
		const subtitle = '¿Seguro de que desea cambiar su contraseña?';

		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: '../../../../../assets/svg/passkey_verde.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._usersServices.updateUser(userEdit).subscribe((res) => {
					let isActive: boolean = true;
					let type: string = 'success';
					let message: string =
						'Excelente, la contraseña se ha cambiado con éxito.';
					if (!res.success) {
						message = res.message;
						type = 'error';
					}
					this._alertService.setAlert({
						isActive,
						message,
						type,
					});
				});
			}
		});
	}

}
