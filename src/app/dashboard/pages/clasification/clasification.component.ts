import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ClasificationService } from '../../services/clasification.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { EditClasificationComponent } from './edit-clasification/edit-clasification.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { ClasificationDetailComponent } from './clasification-detail/clasification-detail.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';

@Component({
  selector: 'app-clasification',
  templateUrl: './clasification.component.html',
  styleUrls: ['./clasification.component.scss']
})
export class ClasificationComponent implements OnInit, AfterViewInit, OnDestroy {
	clasificationList: any[] = [];
	private clasificationListSubscription!: Subscription;
	displayedColumns: string[] = [
		'make',
		'model',
		'lineType',
		'category',
		'actions',
	];
	dataSource = new MatTableDataSource<any>(this.clasificationList);
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _clasificationService: ClasificationService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService
	) {}

	ngOnInit(): void {
		this.clasificationListSubscription =
		this._clasificationService.clasificationList$.subscribe(
			(clasifications: any[]) => {
				this.clasificationList = clasifications;
				this.dataSource.data = clasifications;
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

	openDialogEditClasification(clasification?: any): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(EditClasificationComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: clasification,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) this.openDialogConfirmationClasification(result);
		});
	}

	openDialogClasificationDetail(clasification?: any): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ClasificationDetailComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				clasification,
				disableActions: false
			}
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogEditClasification(clasification);
			if (result == 'delete') this.openDiaglogDisabletClasification(clasification);
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
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
				});
			}
		});
	}

	openDialogConfirmationClasification(
		clasification: any
	): void {
		const title = clasification.id
			? 'Editar clasificación de RAEE'
			: 'Clasificar RAEE';
		const subtitle = clasification.id
			? '¿Seguro de que deseas editar esta clasificación de RAEE?'
			: '¿Seguro de que deseas clasificar este nuevo RAEE?';
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_clasificar_verde_24x24.svg',
				title,
				subtitle,
				type: 'edit',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// TODO: agregar peticion al backend para guardar el registro
				const json: any = {
					id: clasification.id,
					make: clasification.make,
					model: clasification.model,
					lineTypeId: clasification.lineType.id,
					categoryId: clasification.category.id,
					information: clasification.information,
				};

				clasification.status = 'Clasificado';

				this._clasificationService.addClasification(clasification);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el RAEE se ha clasificado con éxito.',
				});
			}
		});
	}

	openDiaglogDisabletClasification(clasification: any) {
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
				this._clasificationService.removeClasification(clasification);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el RAEE se ha eliminado con éxito.',
				});
			}
		});
	}


	ngOnDestroy(): void {
		if (this.clasificationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.clasificationListSubscription.unsubscribe();
		}
	}
}
