import { AlertService } from './../../../shared/services/alert.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { NewGatheringCentersPopupComponent } from './new-gathering-centers-popup/new-gathering-centers-popup.component';
import { ConfirmationGatheringCenterPopupComponent } from './confirmation-gathering-center-popup/confirmation-gathering-center-popup.component';
import {
	GatheringCenter,
	RegisterGatheringCenter,
} from '../../interfaces/gathering-center.interface';
import { GatheringCentersService } from '../../services/gatherin-centers.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
	selector: 'app-gathering-centers',
	templateUrl: './gathering-centers.component.html',
	styleUrls: ['./gathering-centers.component.scss'],
})
export class GatheringCentersComponent implements OnInit, AfterViewInit, OnDestroy {
	gatheringCenterList: GatheringCenter[] = [];
	private gatheringCenterListSubscription!: Subscription;

	displayedColumns: string[] = [
		'manager',
		'state',
		'city',
		'address',
		'status',
		'actions',
	];
	dataSource = new MatTableDataSource<GatheringCenter>(
		this.gatheringCenterList
	);
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private _dialog: MatDialog,
		private viewportRuler: ViewportRuler,
		private gatheringCenterService: GatheringCentersService,
		private cdr: ChangeDetectorRef,
		private alertService: AlertService
	) {}

	ngOnInit(): void {
		this.gatheringCenterListSubscription =
			this.gatheringCenterService.gatheringCenterList$.subscribe(
				(centers: GatheringCenter[]) => {
					this.gatheringCenterList = centers;
					this.dataSource.data = centers;
					this.waitForPaginator();
				}
			);
	}

	waitForPaginator(): void {
		if (!this.paginator) {
				setTimeout(() => {
						this.waitForPaginator();
				}, 100);
		} else {
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
		}
}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;

		this.dataSource.filterPredicate = (
			data: GatheringCenter,
			filter: string
		) => {
			const searchData =
				`${data.manager.name} ${data.state.name} ${data.city.name} ${data.address} ${data.status}`.toLowerCase();
			return searchData.includes(filter.trim().toLowerCase());
		};

		this.dataSource.filterPredicate = (
			data: GatheringCenter,
			filter: string
		) => {
			const searchData =
				`${data.manager.name} ${data.state.name} ${data.city.name} ${data.address} ${data.status}`.toLowerCase();
			const statusMatch =
				data.status.toLowerCase() === filter.trim().toLowerCase();
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

	openDialogNewGatheringCenter(id?: number): void {
		const viewportSize = this.viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(NewGatheringCentersPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {},
		});

		dialogRef.afterClosed().subscribe((result: GatheringCenter) => {
			if (result) this.openDialogConfirmationGatheringCenter(result);
		});
	}

	openDialogConfirmationGatheringCenter(
		gatheringCenter: GatheringCenter
	): void {
		const dialogRef = this._dialog.open(
			ConfirmationGatheringCenterPopupComponent,
			{
				width: '380px',
				height: 'auto',
				autoFocus: false,
			}
		);

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// TODO: agregar peticion al backend para guardar el registro
				const json: RegisterGatheringCenter = {
					id: gatheringCenter.id,
					address: gatheringCenter.address,
					description: gatheringCenter.description,
					managerId: gatheringCenter.manager.id,
					stateId: gatheringCenter.state.id,
					cityId: gatheringCenter.state.id,
				};

				gatheringCenter.status = 'Activo';
				this.gatheringCenterService.addGatheringCenter(gatheringCenter);
				this.cdr.detectChanges();
				this.alertService.setAlert({isActive: true, message: 'Excelente, el centro de acopio se ha registrado con éxito.'})
			}
		});
	}

	ngOnDestroy(): void {
		if (this.gatheringCenterListSubscription) {
			this.alertService.setAlert({isActive: false, message: ''});
			this.gatheringCenterListSubscription.unsubscribe();
		}
	}
}
