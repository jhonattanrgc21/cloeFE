import { ViewportRuler } from '@angular/cdk/scrolling';
import {
	ChangeDetectorRef,
	Component,
	Input,
	ViewChild,
	OnInit,
	AfterViewInit,
	Output,
	EventEmitter,
	SimpleChanges,
	OnChanges,
	OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClasificationDetailComponent } from '../../clasification/clasification-detail/clasification-detail.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { SeparationService } from 'src/app/dashboard/services/separation.service';
import { Clasification } from 'src/app/dashboard/interfaces/clasification.interface';
import { Subscription } from 'rxjs';
import { DOCUMENT_TYPE } from 'src/app/core/constants/constants';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
	selector: 'app-clasification-table',
	templateUrl: './clasification-table.component.html',
	styleUrls: ['./clasification-table.component.scss'],
})
export class ClasificationTableComponent
	implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
	private _clasificationListSubscription!: Subscription;
	@Input() clasificationList: Clasification[] = [];
	@Input() typeRaeeStatus: number = 1; // 1: Todos, 2: clasificados, 3: separados
	@Output() clasificationSelected: any = new EventEmitter<any>();

	@Input() totalItems: number = 0;
	@Input() itemsPerPage = 5;
	@Input() currentPage = 1;
	displayedColumns: string[] = [
		'model',
		'brand',
		'lineType',
		'category',
		'status',
		'actions',
	];
	dataSource = new MatTableDataSource<Clasification>(this.clasificationList);
	@ViewChild(MatPaginator) paginator!: MatPaginator;
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
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _separationService: SeparationService,
		private _generalService: GeneralService
	) {}

	ngOnInit(): void {
		this._clasificationListSubscription =
			this._separationService.raeeList$.subscribe(
				(clasifications: Clasification[]) => {
					this.clasificationList = clasifications;
					this.dataSource.data = clasifications;
					this._cdr.detectChanges();
				}
			);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.dataSource.data = this.clasificationList;
		this.setUpPaginator();
		this._cdr.markForCheck();
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
		this._separationService
			.getRaeeByStatus(page, pageSize, this.typeRaeeStatus)
			.subscribe((response) => {
				this.totalItems = response.meta.total;
				this.itemsPerPage = response.meta.itemsPerPage;
				this.currentPage = response.meta.currentPage;
				this.clasificationList = response.data;
				this.dataSource.data = this.clasificationList;
				this.setUpPaginator();
			});
	}

	ngAfterViewInit() {
		this.setUpPaginator();
	}

	setUpPaginator(): void {
		this._cdr.detectChanges();
		this.length = this.totalItems;
		this.pageSize = this.itemsPerPage;
		this.pageIndex = this.currentPage - 1;

		this.dataSource.filterPredicate = (data: any, filter: string) => {
			const searchData =`${data.model} ${data.brand} ${data.linea} ${data.categoria} ${data.category}  ${data.status}`.toLowerCase();
			const otherColumnsMatch = searchData.includes(
				filter.trim().toLowerCase()
			);
			return otherColumnsMatch;
		};
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openDialogClasificationDetail(clasification: Clasification): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ClasificationDetailComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				clasification,
				disableActions: true,
			},
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
			if (result) {
				const getPdfUrl: string = `split/report-pdf?type=${this.typeRaeeStatus}`;
				const getExcelUrl: string = `split/report-excel?type=${this.typeRaeeStatus}`;
				if (result == 1)
					this._generalService.getDocument(
						'reporte-separacion.xlsx',
						DOCUMENT_TYPE.excel,
						getExcelUrl
					);
				else
					this._generalService.getDocument(
						'reporte-usuarios.pdf',
						DOCUMENT_TYPE.pdf,
						getPdfUrl
					);

				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
				});
			}
		});
	}

	newSeparation(clasification: Clasification) {
		this.clasificationSelected.emit(clasification);
	}


	ngOnDestroy(): void {
		if(this._clasificationListSubscription) this._clasificationListSubscription.unsubscribe();
	}
}
