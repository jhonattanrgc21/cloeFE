import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClasificationService } from '../../services/clasification.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { EditClasificationComponent } from './edit-clasification/edit-clasification.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { ClasificationDetailComponent } from './clasification-detail/clasification-detail.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { Clasification, ClasificationEdit, ClasificationRegister } from '../../interfaces/clasification.interface';
import { DOCUMENT_TYPE } from 'src/app/core/constants/constants';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-clasification',
  templateUrl: './clasification.component.html',
  styleUrls: ['./clasification.component.scss']
})
export class ClasificationComponent implements OnInit, AfterViewInit, OnDestroy {
	private _clasificationListSubscription!: Subscription;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	clasificationList: Clasification[] = [];
	brandsList: SelectionInput[] = [];
	linesList: SelectionInput[] = [];
	categoriesList: SelectionInput[] = [];
	displayedColumns: string[] = [
		'model',
		'brand',
		'lineType',
		'category',
		'actions',
	];
	dataSource = new MatTableDataSource<Clasification>(this.clasificationList);
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
		clasification?: Clasification
	): void {
		let isActive: boolean = true;
		let type: string = 'success';
		if (res.success) {
			if (actionType == 'add')
				this._clasificationService.addClasification(res.data);
			else this._clasificationService.addClasification(clasification!);
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
		private _clasificationService: ClasificationService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _generalService: GeneralService,
		private _authService: AuthService
	) {}

	ngOnInit(): void {
		this.loadClasifications(this.currentPage, this.itemsPerPage);
		this._clasificationListSubscription =
			this._clasificationService.clasificationList$.subscribe(
				(clasifications: Clasification[]) => {
					this.clasificationList = clasifications;
					this.dataSource.data = clasifications;
					this._cdr.detectChanges();
				}
			);

		this._generalService.getBrands().subscribe((res) => {
			this.brandsList = res.success ? res.data : [];
		});

		this._generalService.getCategories().subscribe((res) => {
			this.categoriesList = res.success ? res.data : [];
		});

		this._generalService.getLines().subscribe((res) => {
			this.linesList = res.success ? res.data : [];
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
			this.loadClasifications(this.currentPage + 1, this.pageSize);
		} else {
			this.loadClasifications(this.currentPage - 1, this.pageSize);
		}
	}

	loadClasifications(page: number, pageSize: number): void {
		this._clasificationService
			.getClasifications(page, pageSize)
			.subscribe((response) => {
				this.totalItems = response.meta.total;
				this.itemsPerPage = response.meta.itemsPerPage;
				this.currentPage = response.meta.currentPage;
				this.clasificationList = response.data;
				this.dataSource.data = this.clasificationList;
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
				`${data.name} ${data.model} ${data.brand} ${data.lineType} ${data.category} `.toLowerCase();
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

	openDialogEditClasification(clasification?: Clasification): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(EditClasificationComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {
				clasification,
				brandsList: this.brandsList,
				categoriesList: this.categoriesList,
				linesList: this.linesList
			} ,
		});

		dialogRef.afterClosed().subscribe((result: ClasificationEdit) => {
			if (result) this.openDialogConfirmationClasification(result);
		});
	}


	openDialogConfirmationClasification(
		clasificationEdit: ClasificationEdit
	): void {
		const isEdit = !!clasificationEdit.id;
		const title = isEdit
			? 'Editar clasificación de RAEE'
			: 'Clasificar RAEE';
		const subtitle = isEdit
			? '¿Seguro de que deseas editar esta clasificación de RAEE?'
			: '¿Seguro de que deseas clasificar este nuevo RAEE?';
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
					? this._clasificationService.updateClasification(clasificationEdit)
					: this._clasificationService.createClasification(
						clasificationEdit as ClasificationRegister
					  );

				action$.subscribe((res) =>
					this._handleUserResponse(
						res,
						'Excelente, el RAEE se ha clasificado con éxito.',
						'add'
					)
				);
			}
		});
	}

	openDialogClasificationDetail(clasification?: Clasification): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ClasificationDetailComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				clasification,
				disableActions:  false
			}
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogEditClasification(clasification);
			if (result == 'delete') this.openDiaglogDisabletClasification(clasification!);
		});
	}


	openDiaglogDisabletClasification(clasification: Clasification) {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_clasificar_rojo_24x24.svg',
				title: 'Eliminar RAEE',
				subtitle: '¿Seguro de que deseas eliminar este RAEE?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._clasificationService.deleteClasification(clasification.id).subscribe(res => {
					let type: string = 'success';
					let message: string;
					if(res.success) {
						message = 'Excelente, el RAEE se ha eliminado con éxito.';
						type = 'success';
						this._clasificationService.removeClasification(clasification);
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

	openDialogClasificationDownload(): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(DownloadPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result){
				const getPdfUrl = 'raee/report-pdf';
				const getExcelUrl = 'raee/report-excel';

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
		if (this._clasificationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this._clasificationListSubscription.unsubscribe();
		}
	}
}
