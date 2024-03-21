import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UsersService } from '../../services/users.service';
import { EditUserPopupComponent } from './edit-user-popup/edit-user-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
	userList: any[] = [];
	private userListSubscription!: Subscription;
	displayedColumns: string[] = [
		'firstName',
		'lastName',
		'identification',
		'employePosition',
		'state',
		'city',
		'address',
		'actions',
	];
	dataSource = new MatTableDataSource<any>(this.userList);
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _usersServices: UsersService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService
	) {}

	ngOnInit(): void {
		this.userListSubscription =
		this._usersServices.userList$.subscribe(
			(users: any[]) => {
				this.userList = users;
				this.dataSource.data = users;
				this.waitForPaginator();
			}
		);
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;

		this.dataSource.filterPredicate = (
			data: any,
			filter: string
		) => {
			const searchData =
				`${data.firstName} ${data.lastName} ${data.identification} ${data.employePosition} ${data.state.name} ${data.city.name} ${data.address}`.toLowerCase();
			const otherColumnsMatch = searchData.includes(
				filter.trim().toLowerCase()
			);
			return otherColumnsMatch;
		};
	}

	waitForPaginator(): void {
		if (!this.paginator) {
			setTimeout(() => {
				this.waitForPaginator();
			}, 100);
		} else {
			this.dataSource.paginator = this.paginator;
			this._cdr.detectChanges();
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openDialogEditUser(user?: any): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(EditUserPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: user,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) this.openDialogConfirmationUser(result);
		});
	}

	openDialogConfirmationUser(
		user: any
	): void {
		const title = user.id
			? 'Editar usuario'
			: 'Registrar usuario';
		const subtitle = user.id
			? '¿Seguro de que deseas editar este usuario?'
			: '¿Seguro de que deseas registrar este usuario?';
		const description = user.id
			? ''
			: 'Se enviará un correo electrónico al usuario desde el cual podrá establecer su contraseña para acceder al sistema.';
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_usuarios_verde_24x24.svg',
				title,
				subtitle,
				description,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// TODO: agregar peticion al backend para guardar el registro
				const json: any = {

					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					identificatrion: user.identificatrion,
					address: user.address,
					stateId: user.state.id,
					cityId: user.city.id,
					employePositionId: user.employePosition.id
				};

				this._usersServices.addUser(user);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el usuario se ha guardado con éxito.',
				});
			}
		});
	}

	openDiaglogDisabletUser(user: any) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_usuarios_rojo_24x24.svg',
				title: 'Eliminar usuario',
				subtitle: '¿Seguro de que deseas eliminar este usuario?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._usersServices.removeUser(user);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el usuario se ha eliminado con éxito.',
				});
			}
		});
	}


	ngOnDestroy(): void {
		if (this.userListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.userListSubscription.unsubscribe();
		}
	}
}
