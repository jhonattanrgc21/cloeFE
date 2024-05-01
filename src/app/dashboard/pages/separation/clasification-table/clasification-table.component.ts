import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, Input, ViewChild, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClasificationDetailComponent } from '../../clasification/clasification-detail/clasification-detail.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { ClasificationService } from 'src/app/dashboard/services/clasification.service';
import { SeparationService } from 'src/app/dashboard/services/separation.service';

@Component({
	selector: 'app-clasification-table',
	templateUrl: './clasification-table.component.html',
	styleUrls: ['./clasification-table.component.scss'],
})
export class ClasificationTableComponent implements OnInit, AfterViewInit {
	@Input() data: any[] = [];
	@Output() clasificationSelected: any = new EventEmitter<any>();
	@Output() separationSelected: any = new EventEmitter<any>();
	displayedColumns: string[] = [
		'make',
		'model',
		'lineType',
		'category',
		'status',
		'actions',
	];
	dataSource = new MatTableDataSource<any>(this.data);
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _clasificationService: ClasificationService,
		private _separationService: SeparationService
	) {}


	ngOnInit(): void {
		this.dataSource.data = this.data;
		this.waitForPaginator();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;

		this.dataSource.filterPredicate = (data: any, filter: string) => {
			const searchData =
				`${data.make} ${data.model} ${data.lineType.name} ${data.category.name} ${data.information}`.toLowerCase();
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
			}, 1000);
		} else {
			this.dataSource.paginator = this.paginator;
			this._cdr.detectChanges();
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openDialogClasificationDetail(clasification: any): void {
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
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
				});
			}
		});
	}

	newSeparation(clasification: any){
		this.clasificationSelected.emit(clasification);
	}

	openSeparationDetail(separation: any) {
	}

	openEditSeparation(separation: any){
		this.separationSelected.emit(separation);
	}

	openDiaglogDisabletSeparation(clasification: any){
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../../assets/svg/icono_sidebar_separar_rojo_24x24.svg',
				title: 'Eliminar separación de RAEE',
				subtitle: '¿Seguro de que deseas eliminar este separación de RAEE?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this._separationService.removeSeparation(clasification.raeeId);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, la separación de RAEE se ha eliminado con éxito.',
				});
			}
		});
	}
}
