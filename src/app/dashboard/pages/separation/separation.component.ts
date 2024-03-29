import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ClasificationService } from '../../services/clasification.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { ClasificationDetailComponent } from '../clasification/clasification-detail/clasification-detail.component';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-separation',
  templateUrl: './separation.component.html',
  styleUrls: ['./separation.component.scss']
})
export class SeparationComponent implements OnInit, AfterViewInit, OnDestroy {

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
	@ViewChild(MatTabGroup) matTabGroup: any;

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
			}, 1000);
		} else {
			this.dataSource.paginator = this.paginator;
			this._cdr.detectChanges();
		}
	}

	handleTabChange() {
		switch (this.matTabGroup.selectedIndex) {
			case 0:
				this.dataSource.data = this.clasificationList;
				break;
			case 1:
				this.dataSource.data = this.clasificationList.filter(
					(elem) => elem.status == 'Clasificado'
				);
				break;
			case 2:
				this.dataSource.data = this.clasificationList.filter(
					(elem) => elem.status == 'Separado'
				);
				break;
		}
		
		this.waitForPaginator();
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openDialogClasificationDetail(clasification?: any): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ClasificationDetailComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				clasification,
				disableActions: true
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
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el reporte se ha descargado con éxito.',
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
