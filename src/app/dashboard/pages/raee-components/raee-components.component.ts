import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { RaeeComponentsService } from '../../services/raee-components.service';
import { ComponentEditComponent } from '../separation/component-edit/component-edit.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { DOCUMENT_TYPE } from 'src/app/core/constants/constants';
import { RaeeComponent, RaeeComponentEdit } from '../../interfaces/raee-component.interface';
import { ViewComponentComponent } from '../separation/view-component/view-component.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-raee-components',
  templateUrl: './raee-components.component.html',
  styleUrls: ['./raee-components.component.scss']
})
export class RaeeComponentsComponent implements OnInit, OnDestroy {
	private _componentsListSubscription!: Subscription;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	componentsList: RaeeComponent[] = [];
	materialsList: SelectionInput[] = [];
	processList: SelectionInput[] = [];
	displayedColumns: string[] = [
		'name',
		'weight',
		'dimensions',
		'reutilizable',
		'actions',
	];
	dataSource = new MatTableDataSource<RaeeComponent>(this.componentsList);
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

	private _handleUserResponse(
		res: any,
		message: string,
		actionType: 'add' | 'modifyStatus',
		component?: RaeeComponent
	): void {
		let isActive: boolean = true;
		let type: string = 'success';
		if (res.success) {
			if (actionType == 'add')
				this._raeeComponentsServices.addComponent(res.data);
			else this._raeeComponentsServices.addComponent(component!);
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
		private _raeeComponentsServices: RaeeComponentsService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _generalService: GeneralService,
		private _authService: AuthService
	) {}

	ngOnInit(): void {
		this.loadComponents(this.currentPage, this.itemsPerPage);
		this._componentsListSubscription =
			this._raeeComponentsServices.raeeComponentList$.subscribe(
				(components: RaeeComponent[]) => {
					this.componentsList = components;
					this.dataSource.data = this.componentsList;
					this._cdr.detectChanges();
				}
			);

		this._generalService.getMaterials().subscribe((res) => {
			this.materialsList = res.success ? res.data : [];
		});

		this._generalService.getProcess().subscribe((res) => {
			this.processList = res.success ? res.data : [];
		});
	}

	isAdminRole() {
		return this._authService.currentRole == 'admin';
	}

	handlePageEvent(e: PageEvent) {
		this.pageEvent = e;
		this.length = e.length;
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
		if (e.previousPageIndex! < e.pageIndex) {
			this.loadComponents(this.currentPage + 1, this.pageSize);
		} else {
			this.loadComponents(this.currentPage - 1, this.pageSize);
		}
	}

	loadComponents(page: number, pageSize: number): void {
		this._raeeComponentsServices.getComponents(page, pageSize)
			.subscribe((response) => {
				this.totalItems = response.meta.total;
				this.itemsPerPage = response.meta.itemsPerPage;
				this.currentPage = response.meta.currentPage;
				this.componentsList = response.data;
				this.dataSource.data = this.componentsList;
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
			const searchData =	`${data.name} ${data.weight} ${data.brand} ${data.dimensions}`.toLowerCase();
			const statusMatch =
				(data.reusable == 1 ? 'Si' : 'No').toLowerCase() ===
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

	openDialogComponentEdit(component?: RaeeComponent) {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ComponentEditComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {
				materialList: this.materialsList,
				processList: this.processList,
				component,
			},
		});


		dialogRef.afterClosed().subscribe((result: RaeeComponentEdit) => {
			if (result) this.openDialogConfirmationComponent(result);
		});
	}


	openDialogConfirmationComponent(
		componentEdit: RaeeComponentEdit
	): void {
		const title = 'Editar componente de RAEE';
		const subtitle = '¿Seguro de que deseas editar esta componente de RAEE?';
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_separar_verde_24x24.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const action$ = this._raeeComponentsServices.updateComponent(componentEdit);

				action$.subscribe((res) =>
					this._handleUserResponse(
						res,
						'Excelente, el RAEE se ha actualizado con éxito.',
						'add'
					)
				);
			}
		});
	}

	openDialogComponentDetail(component: RaeeComponent): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ViewComponentComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				component,
				disableActions: false
			}
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogComponentEdit(component);
			if (result == 'delete') this.openDiaglogRemoveComponent(component!);
		});
	}


	openDiaglogRemoveComponent(component: RaeeComponent) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_separar_rojo_24x24.svg',
				title: 'Eliminar componente de RAEE',
				subtitle: '¿Seguro de que deseas eliminar este componente de RAEE?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._raeeComponentsServices.deleteComponent(component.component_id).subscribe(res => {
					let type: string = 'success';
					let message: string;
					if(res.success) {
						message = 'Excelente, el componente RAEE se ha eliminado con éxito.';
						type = 'success';
						this._raeeComponentsServices.removeComponent(component);
					}
					else{
						message = res.message;
						type = 'error';
					}
					this._cdr.detectChanges();
					this._alertService.setAlert({
						isActive: true,
						message,
						type
					});
				})
			}
		});
	}

	openDialogComponentDownload(): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(DownloadPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result){
				const getPdfUrl = 'components/report-pdf';
				const getExcelUrl = 'components/report-excel';

				if(result == 1)	this._generalService.getDocument('reporte-componentes-raee.xlsx', DOCUMENT_TYPE.excel, getExcelUrl);
				else this._generalService.getDocument('reporte-componentes-raee.pdf',DOCUMENT_TYPE.pdf , getPdfUrl);

				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
				});
			}
		});
	}

	ngOnDestroy(): void {
		if (this._componentsListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this._componentsListSubscription.unsubscribe();
		}
	}
}
