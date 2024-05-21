import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, filter, first } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UsersService } from '../../services/users.service';
import { EditUserPopupComponent } from './edit-user-popup/edit-user-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { UserDetailPopupComponent } from './user-detail-popup/user-detail-popup.component';
import { User, UserEdit, UserRegister } from '../../interfaces/users.interface';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
	userList: User[] = [];
	private _userListSubscription!: Subscription;
	displayedColumns: string[] = [
		'firstName',
		'lastName',
		'identification',
		'employePosition',
		'status',
		'actions',
	];
	dataSource = new MatTableDataSource<User>(this.userList);
	@ViewChild('userPaginator') paginator!: MatPaginator;
	totalItems: number = 0;
  itemsPerPage = 5; // Default value, can be overridden by the response
  currentPage = 1;

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _usersServices: UsersService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService
	) {}

	private _handleUserResponse(
		res: any,
		message: string,
		actionType: 'add' | 'modifyStatus'
	): void {
		let isActive: boolean = true;
		let type: string = 'success';
		if (res.success) {
			if (actionType == 'add') this._usersServices.addUser(res.data);
			else this._usersServices.modifyStatusUser(res.data);
		} else {
			isActive = false;
			message = res.message;
			type = 'error';
		}

		this._cdr.detectChanges();
		this._alertService.setAlert({
			isActive,
			message,
		});
	}

	ngOnInit(): void {
		this.loadUsers(1, this.itemsPerPage);
		this._userListSubscription = this._usersServices.userList$.subscribe(
			(users: User[]) => {
				this.userList = users;
				this.dataSource.data = users;
				this._cdr.detectChanges();
			}
		);
	}

	ngAfterViewInit(): void {
		setTimeout(() => this.setUpPaginator(), 1000);
	}

	setUpPaginator(): void {
		this._cdr.detectChanges();

		this.paginator.length = this.totalItems;
		this.paginator.pageSize = this.itemsPerPage;
		this.paginator.pageIndex = this.currentPage - 1;
		this.paginator.page.subscribe(() => {
			this.currentPage = this.paginator.pageIndex + 1;
			this.loadUsers(this.currentPage, this.paginator.pageSize);
			this.paginator.length = this.totalItems;
			this.paginator.pageSize = this.itemsPerPage;
			this.paginator.pageIndex = this.currentPage - 1;
		});


		this.dataSource.filterPredicate = (data: any, filter: string) => {
			const searchData = `${data.firstName} ${data.lastName} ${data.identification} ${data.employePosition}`.toLowerCase();
			const statusMatch = data.status.toLowerCase() === filter.trim().toLowerCase();
			const otherColumnsMatch = searchData.includes(filter.trim().toLowerCase());
			return statusMatch || otherColumnsMatch;
		};
  }


	loadUsers(page: number, pageSize: number): void {
		this._usersServices.getUsers(page, pageSize).subscribe((response) => {
			this.totalItems = response.meta.total;
      this.itemsPerPage = response.meta.itemsPerPage;
      this.currentPage = response.meta.currentPage;
			this.userList = response.data; // Actualiza la lista de usuarios
			this.dataSource.data = this.userList; // Asignar los datos al dataSource
			this.dataSource.paginator = this.paginator;
			this._cdr.detectChanges();
		});
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openDialogEditUser(user?: User): void {
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

	openDialogConfirmationUser(userEdit: UserEdit): void {
		const isEdit = !!userEdit.id;
		const title = isEdit ? 'Editar usuario' : 'Registrar usuario';
		const subtitle = isEdit
			? '¿Seguro de que deseas editar este usuario?'
			: '¿Seguro de que deseas registrar este usuario?';
		const description = isEdit
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
				type: isEdit ? 'edit' : 'register',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const action$ = isEdit
					? this._usersServices.updateUser(userEdit)
					: this._usersServices.createUser(userEdit as UserRegister);

				action$.subscribe((res) =>
					this._handleUserResponse(
						res,
						'Excelente, el usuario se ha guardado con éxito.',
						'add'
					)
				);
			}
		});
	}

	openDiaglogDisabletUser(user: User) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_usuarios_rojo_24x24.svg',
				title: 'Desactivar usuario',
				subtitle: '¿Seguro de que deseas desactivar este usuario?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const userEdit: UserEdit = {
					id: user.id,
					active: 0,
				};

				const action$ = this._usersServices.updateUser(userEdit);
				action$.subscribe((res) =>
					this._handleUserResponse(
						res,
						'Excelente, el usuario se ha desactivado con éxito.',
						'modifyStatus'
					)
				);
			}
		});
	}

	openDiaglogEnableUser(user: User) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_usuarios_verde_24x24.svg',
				title: 'Activar usuario',
				subtitle: '¿Seguro de que deseas activar este usuario?',
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const userEdit: UserEdit = {
					id: user.id,
					active: 1,
				};

				const action$ = this._usersServices.updateUser(userEdit);
				action$.subscribe((res) =>
					this._handleUserResponse(
						res,
						'Excelente, el usuario se ha activado con éxito.',
						'modifyStatus'
					)
				);
			}
		});
	}

	openDialogUserDetail(user: User) {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(UserDetailPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				user,
				disableActions: false,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogEditUser(user);
			if (result == 'delete') this.openDiaglogDisabletUser(user);
		});
	}

	ngOnDestroy() {
		if (this._userListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this._userListSubscription.unsubscribe();
		}
	}
}
