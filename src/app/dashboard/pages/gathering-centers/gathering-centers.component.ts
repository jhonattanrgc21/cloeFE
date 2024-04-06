import { AlertService } from './../../../shared/services/alert.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { NewGatheringCentersPopupComponent } from './new-gathering-centers-popup/new-gathering-centers-popup.component';
import {
	GatheringCenter,
	RegisterGatheringCenter,
} from '../../interfaces/gathering-center.interface';
import { GatheringCentersService } from '../../services/gatherin-centers.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';

@Component({
	selector: 'app-gathering-centers',
	templateUrl: './gathering-centers.component.html',
	styleUrls: ['./gathering-centers.component.scss'],
})
export class GatheringCentersComponent
	implements OnInit, AfterViewInit, OnDestroy
{
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
		private _viewportRuler: ViewportRuler,
		private _gatheringCenterService: GatheringCentersService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService
	) {}

	ngOnInit(): void {
		this.gatheringCenterListSubscription =
			this._gatheringCenterService.gatheringCenterList$.subscribe(
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
			this._cdr.detectChanges();
		}
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;

		this.dataSource.filterPredicate = (
			data: GatheringCenter,
			filter: string
		) => {
			const searchData =
				`${data.manager.name} ${data.state.name} ${data.city.name} ${data.address}`.toLowerCase();
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

	openDialogNewGatheringCenter(center?: GatheringCenter): void {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(NewGatheringCentersPopupComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: center,
		});

		dialogRef.afterClosed().subscribe((result: GatheringCenter) => {
			if (result) this.openDialogConfirmationGatheringCenter(result);
		});
	}

	openDialogConfirmationGatheringCenter(
		gatheringCenter: GatheringCenter
	): void {
		const title = gatheringCenter.id
			? 'Editar centro de acopio'
			: 'Registrar centro de acopio';
		const subtitle = gatheringCenter.id
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
				// TODO: agregar peticion al backend para guardar el registro
				const json: RegisterGatheringCenter = {
					id: gatheringCenter.id,
					address: gatheringCenter.address,
					description: gatheringCenter.description,
					managerId: gatheringCenter.manager.id,
					stateId: gatheringCenter.state.id,
					cityId: gatheringCenter.state.id,
				};

				this._gatheringCenterService.addGatheringCenter(gatheringCenter);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el centro de acopio se ha guardado con éxito.',
				});
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
				this._gatheringCenterService.modifyStatusGatheringCenter(center);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el centro de acopio se ha desactivado con éxito.',
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
				this._gatheringCenterService.modifyStatusGatheringCenter(center);
				this._cdr.detectChanges();
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el centro de acopio se ha activado con éxito.',
				});
			}
		});
	}

	ngOnDestroy(): void {
		if (this.gatheringCenterListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.gatheringCenterListSubscription.unsubscribe();
		}
	}
}
