import { ViewportRuler } from '@angular/cdk/scrolling';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UsersService } from '../../services/users.service';
import { EditUserPopupComponent } from './edit-user-popup/edit-user-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { UserDetailPopupComponent } from './user-detail-popup/user-detail-popup.component';
import { User, UserEdit, UserRegister } from '../../interfaces/users.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { GeneralService } from 'src/app/shared/services/general.service';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';
import { GatheringCenterCard } from 'src/app/landing/interfaces/gathering-center.interface';
import { DOCUMENT_TYPE } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
	userList: User[] = [];
	statesList: SelectionInput[] = [];
	centersList: SelectionInput[] = [];
	rolesList: string[] = [];
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
	itemsPerPage = 5;
	currentPage = 1;
	length = 0;
	pageSize = 5;
	pageIndex = 1;
	pageSizeOptions = [5, 10, 25];
	hidePageSize = false;
	showPageSizeOptions = true;
	showFirstLastButtons = true;
	disabled = false;
	pageEvent: PageEvent = new PageEvent();

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _usersServices: UsersService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _generalService: GeneralService
	) {}

	private _handleUserResponse(
		res: any,
		message: string,
		actionType: 'add' | 'modifyStatus', user?: User
	): void {
		let isActive: boolean = true;
		let type: string = 'success';
		if (res.success) {
			if (actionType == 'add') this._usersServices.addUser(res.data);
			else this._usersServices.addUser(user!);
		} else {
			message = res.message;
			type = 'error';
		}

		this._cdr.detectChanges();
		this._alertService.setAlert({
			isActive,
			message,
			type,
		});
	}

	handlePageEvent(e: PageEvent) {
		this.pageEvent = e;
		this.length = e.length;
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
		if (e.previousPageIndex! < e.pageIndex) {
			this.loadUsers(this.currentPage + 1, this.pageSize);
		} else {
			this.loadUsers(this.currentPage - 1, this.pageSize);
		}
	}

	ngOnInit(): void {
		this.loadUsers(this.currentPage, this.itemsPerPage);
		this._userListSubscription = this._usersServices.userList$.subscribe(
			(users: User[]) => {
				this.userList = users;
				this.dataSource.data = users;
				this._cdr.detectChanges();
			}
		);
		this._generalService.getStates().subscribe((res) => {
			this.statesList = res.success ? res.data : [];
		});

		this._generalService.getRoles().subscribe((res) => {
			this.rolesList = res ?? [];
		});

		const centersFilter: SelectFilter = { filters: { estado_id: null, ciudad_id: null } };
		this._generalService.getGatheringCenters(centersFilter).subscribe(res => {
			if(!res.success) this.centersList = [];
			else{
				const centers: GatheringCenterCard[] = res.data;
				centers.forEach(center => {
					this.centersList.push({id: center.centro_id, name: center.name});
				})
			}
		});
	}

	ngAfterViewInit(): void {
		setTimeout(() => this.setUpPaginator(), 2000);
	}

	setUpPaginator(): void {
		this._cdr.detectChanges();
		this.length = this.totalItems;
		this.pageSize = this.itemsPerPage;
		this.pageIndex = this.currentPage - 1;

		this.dataSource.filterPredicate = (data: any, filter: string) => {
			const searchData =
				`${data.name} ${data.lastname} ${data.cedula_type}-${data.cedula_number} ${data.role}`.toLowerCase();
			const statusMatch =
				(data.active == 1 ? 'Activo' : 'Inactivo').toLowerCase() ===
				filter.trim().toLowerCase();
			const otherColumnsMatch = searchData.includes(
				filter.trim().toLowerCase()
			);
			return statusMatch || otherColumnsMatch;
		};
	}
	loadUsers(page: number, pageSize: number): void {
		this._usersServices.getUsers(page, pageSize).subscribe((response) => {
			this.totalItems = response.meta.total;
			this.itemsPerPage = response.meta.itemsPerPage;
			this.currentPage = response.meta.currentPage;
			this.userList = response.data;
			this.dataSource.data = this.userList;
			this.dataSource.paginator = this.paginator;
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
			data: {
				user,
				statesList: this.statesList,
				rolesList: this.rolesList,
				centersList: this.centersList
			},
		});

		dialogRef.afterClosed().subscribe((result: UserEdit) => {
			if (result) this.openDialogConfirmationUser(result);
		});
	}

	openDialogConfirmationUser(userEdit: UserEdit): void {
		const title = userEdit.id ? 'Editar usuario' : 'Registrar usuario';
		const subtitle = userEdit.id
			? '¿Seguro de que deseas editar este usuario?'
			: '¿Seguro de que deseas registrar este usuario?';
		const description = userEdit.id
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
				const action$ = userEdit.id
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
				let userEdit: UserEdit = user as UserEdit;
				userEdit.active = 0;
				const json = {
					id: userEdit.id,
					active: 0
				}
				const action$ = this._usersServices.updateUser(json);
				action$.subscribe((res) => {
					user.active = userEdit.active = 0;
					this._handleUserResponse(
						res,
						'Excelente, el usuario se ha desactivado con éxito.',
						'modifyStatus',
						user
					)
				}
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
				let userEdit: UserEdit = user as UserEdit;
				userEdit.active = 1;
				const json = {
					id: userEdit.id,
					active: 1
				}

				const action$ = this._usersServices.updateUser(json);
				action$.subscribe((res) => {
					user.active = 1;
					this._handleUserResponse(
						res,
						'Excelente, el usuario se ha activado con éxito.',
						'modifyStatus',
						user
					)
				}
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

	openDialogUsersDownload(): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(DownloadPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result){
				const getPdfUrl: string = 'users/report-pdf';
				const getExcelUrl: string = 'users/report-excel';
				if(result == 1)	this._generalService.getDocument('reporte-usuarios.xlsx', DOCUMENT_TYPE.excel, getExcelUrl);
				else this._generalService.getDocument('reporte-usuarios.pdf', DOCUMENT_TYPE.pdf, getPdfUrl);

				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
				});
			}
		});
	}


	ngOnDestroy() {
		if (this._userListSubscription) this._userListSubscription.unsubscribe();
		this._alertService.setAlert({ isActive: false, message: '' });
	}
}
