import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';

@Component({
	selector: 'app-dashboard-sidebar',
	templateUrl: './dashboard-sidebar.component.html',
	styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {
	@Output() sidebarToggled = new EventEmitter<void>();
	constructor(
		private _router: Router,
		private _dialog: MatDialog,
		private _authService: AuthService) { }

	showOption(allowedRoles: string[]) {
		return this._authService.hasRole(allowedRoles);
	}

	toggleSidebar() {
		this.sidebarToggled.emit();
	}


	logout() {
		const title = 'Cerrar sesión';
		const subtitle = '¿Seguro de que desea salir del sistema?';
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: '../../../../assets/svg/logout_verde.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._authService.logout().subscribe(res => {
					if (res.success) this._router.navigateByUrl('/auth/sign-in');
				});
			}
		});

	}
}
