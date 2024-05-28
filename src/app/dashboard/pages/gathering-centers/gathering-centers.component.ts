import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AlertService } from './../../../shared/services/alert.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NewGatheringCentersPopupComponent } from './new-gathering-centers-popup/new-gathering-centers-popup.component';
import {
	GatheringCenter,
	GatheringCenterRegister, GatheringCenterUpdate,
} from '../../interfaces/gathering-center.interface';
import { GatheringCentersService } from '../../services/gatherin-centers.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { GeneralService } from 'src/app/shared/services/general.service';
import { GatheringCenterDetailComponent } from './gathering-center-detail/gathering-center-detail.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { DOCUMENT_TYPE } from 'src/app/core/constants/constants';
import { UsersService } from '../../services/users.service';

@Component({
	selector: 'app-gathering-centers',
	templateUrl: './gathering-centers.component.html',
	styleUrls: ['./gathering-centers.component.scss'],
})
export class GatheringCentersComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	private _gatheringCenterListSubscription!: Subscription;
	@ViewChild('gatheringCenterPaginator') paginator!: MatPaginator;
	gatheringCenterList: GatheringCenter[] = [];
	statesList: SelectionInput[] = [];
	managerList : SelectionInput[] = [];
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

	displayedColumns: string[] = ['name', 'state', 'city', 'status', 'actions'];

	dataSource = new MatTableDataSource<GatheringCenter>(
		this.gatheringCenterList
	);

	private _handleUserResponse(
		res: any,
		message: string,
		actionType: 'add' | 'modifyStatus',
		gtheringCenter?: GatheringCenter
	): void {
		let isActive: boolean = true;
		let type: string = 'success';
		if (res.success) {
			if (actionType == 'add')
				this._gatheringCenterService.addGatheringCenter(res.data);
			else this._gatheringCenterService.addGatheringCenter(gtheringCenter!);
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

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _gatheringCenterService: GatheringCentersService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _generalService: GeneralService,
		private _usersService: UsersService
	) {}

	ngOnInit(): void {
		this.loadGatheringCenters(this.currentPage, this.itemsPerPage);
		this._gatheringCenterListSubscription =
			this._gatheringCenterService.gatheringCenterList$.subscribe(
				(centers: GatheringCenter[]) => {
					this.gatheringCenterList = centers;
					this.dataSource.data = centers;
					this._cdr.detectChanges();
				}
			);

		this._generalService.getStates().subscribe((res) => {
			this.statesList = res.success ? res.data : [];
		});

		this._usersService
			.getUsersByRole({
				roleName: 'Encargado',
				estado_id: 7,
			})
			.subscribe((res) => {
				this.managerList = res.success ? res.data: [];
			});
	}

	handlePageEvent(e: PageEvent) {
		this.pageEvent = e;
		this.length = e.length;
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
		if (e.previousPageIndex! < e.pageIndex) {
			this.loadGatheringCenters(this.currentPage + 1, this.pageSize);
		} else {
			this.loadGatheringCenters(this.currentPage - 1, this.pageSize);
		}
	}

	loadGatheringCenters(page: number, pageSize: number): void {
		this._gatheringCenterService
			.getGatheringCenters(page, pageSize)
			.subscribe((response) => {
				this.totalItems = response.meta.total;
				this.itemsPerPage = response.meta.itemsPerPage;
				this.currentPage = response.meta.currentPage;
				this.gatheringCenterList = response.data;
				this.dataSource.data = this.gatheringCenterList;
				this.dataSource.paginator = this.paginator;
			});
	}

	ngAfterViewInit() {
		setTimeout(() => this.setUpPaginator(), 2000);
	}

	setUpPaginator(): void {
		this._cdr.detectChanges();
		this.length = this.totalItems;
		this.pageSize = this.itemsPerPage;
		this.pageIndex = this.currentPage - 1;

		this.dataSource.filterPredicate = (data: any, filter: string) => {
			const searchData =
				`${data.name} ${data.estado} ${data.ciudad} ${data.address}`.toLowerCase();
			const statusMatch =
				(data.active == 1 ? 'Activo' : 'Inactivo').toLowerCase() ===
				filter.trim().toLowerCase();
			const otherColumnsMatch = searchData.includes(
				filter.trim().toLowerCase()
			);
			return statusMatch || otherColumnsMatch;
		};
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openDialogNewGatheringCenter(center?: GatheringCenter): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(NewGatheringCentersPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {
				center,
				statesList: this.statesList,
				managerList: this.managerList
			},
		});

		dialogRef.afterClosed().subscribe((result: GatheringCenterUpdate) => {
			if (result) this.openDialogConfirmationGatheringCenter(result);
		});
	}

	openDialogConfirmationGatheringCenter(
		gatheringCenter: GatheringCenterUpdate
	): void {
		const isEdit = !!gatheringCenter.centro_id;
		const title = isEdit
			? 'Editar centro de acopio'
			: 'Registrar centro de acopio';
		const subtitle = isEdit
			? '¿Seguro de que deseas editar este centro de acopio?'
			: '¿Seguro de que deseas registrar este centro de acopio?';
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_centros_acopios_verde_24x24.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const action$ = isEdit
					? this._gatheringCenterService.updateGatheringCenter(gatheringCenter)
					: this._gatheringCenterService.createGatheringCenter(
							gatheringCenter as GatheringCenterRegister
					  );

				action$.subscribe((res) =>
					this._handleUserResponse(
						res,
						'Excelente, el centro de acopio se ha guardado con éxito.',
						'add'
					)
				);
			}
		});
	}

	openDisabletGatheringCenter(center: GatheringCenter) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_centros_acopios_rojo_24x24.svg',
				title: 'Desactivar centro de acopio',
				subtitle: '¿Seguro de que deseas desactivar este centro de acopio?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				let gatheringCenterUpdate: GatheringCenterUpdate =
					center as GatheringCenterUpdate;
				gatheringCenterUpdate.active = 0;
				const action$ = this._gatheringCenterService.updateGatheringCenter(
					gatheringCenterUpdate
				);
				action$.subscribe((res) => {
					center.active = gatheringCenterUpdate.active = 0;
					this._handleUserResponse(
						res,
						'Excelente, el centro de acopio se ha desactivado con éxito.',
						'modifyStatus',
						center
					);
				});
			}
		});
	}

	openEnabletGatheringCenter(center: GatheringCenter) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_centros_acopios_verde_24x24.svg',
				title: 'Activar centro de acopio',
				subtitle: '¿Seguro de que deseas activar este centro de acopio?',
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				let gatheringCenterUpdate: GatheringCenterUpdate =
					center as GatheringCenterUpdate;
				gatheringCenterUpdate.active = 1;

				const action$ = this._gatheringCenterService.updateGatheringCenter(
					gatheringCenterUpdate
				);
				action$.subscribe((res) => {
					center.active = gatheringCenterUpdate.active = 0;
					this._handleUserResponse(
						res,
						'Excelente, el centro de acopio se ha activado con éxito.',
						'modifyStatus',
						center
					);
				});
			}
		});
	}

	openDialogGatheringCenterDetail(center: GatheringCenter) {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(GatheringCenterDetailComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				center,
				disableActions: false,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogNewGatheringCenter(center);
			if (result == 'delete') this.openDisabletGatheringCenter(center);
		});
	}

	openDialogGatheringCenterDownload(): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(DownloadPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result){
				const getPdfUrl = 'centro-acopio/report-pdf';
				const getExcelUrl = 'centro-acopio/report-excel';

				if(result == 1)	this._generalService.getDocument('reporte-centros-acopio.xlsx', DOCUMENT_TYPE.excel, getExcelUrl);
				else this._generalService.getDocument('reporte-centros-acopio.pdf',DOCUMENT_TYPE.pdf , getPdfUrl);

				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
				});
			}
		});
	}

	ngOnDestroy(): void {
		if (this._gatheringCenterListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this._gatheringCenterListSubscription.unsubscribe();
		}
	}
}
