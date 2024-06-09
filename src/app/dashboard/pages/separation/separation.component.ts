import { ViewportRuler } from '@angular/cdk/scrolling';
import {
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ComponentEditComponent } from './component-edit/component-edit.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { Separation } from '../../interfaces/separation.interface';
import { SeparationService } from './../../services/separation.service';
import { ViewComponentComponent } from './view-component/view-component.component';
import { Clasification } from '../../interfaces/clasification.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { RaeeComponent, RaeeComponentEdit } from '../../interfaces/raee-component.interface';
import { RaeeComponentsService } from '../../services/raee-components.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
	selector: 'app-separation',
	templateUrl: './separation.component.html',
	styleUrls: ['./separation.component.scss'],
})
export class SeparationComponent implements OnInit, OnDestroy {
	isActiveSeparationView: boolean = false;
	raeeSelected: any;
	separationRaeeList: any[] = [];
	componentsList: RaeeComponent[] = [];
	materialList: SelectionInput[] = [];
	processList: SelectionInput[] = [];
	separation!: Separation;

	clasificationList: Clasification[] = [];
	totalItems: number = 0;
	itemsPerPage = 5;
	currentPage = 1;

	private separationListSubscription!: Subscription;
	@ViewChild(MatTabGroup) matTabGroup: any;

	dataSource = new MatTableDataSource<any>(this.componentsList);
	displayedColumns = [
		'name',
		'weight',
		'dimensions',
		'reutilizable',
		'actions',
	];

	constructor(
		private _separationService: SeparationService,
		private _viewportRuler: ViewportRuler,
		private _dialog: MatDialog,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _generalService: GeneralService,
		private _raeeComponentsService: RaeeComponentsService,
		private _authService: AuthService
	) {}

	private updateComponentList(component_id: number) {
		const index = this.componentsList.findIndex(
			(item) => item.component_id === component_id
		);
		if (index !== -1) {
			this.componentsList.splice(index, 1);
			this.updateDataSource();
		}
	}

	private updateDataSource() {
		this.dataSource.data = this.componentsList;
		this._cdr.detectChanges();
	}

	private showAlert(message: string) {
		this._alertService.setAlert({
			isActive: true,
			message: 'Excelente, el componente se ha eliminado con éxito.',
		});
	}

	ngOnInit(): void {
		this.loadClasifications(1, 5, 1);
		this._generalService.getMaterials().subscribe((res) => {
			this.materialList = res.success ? res.data : [];
		});

		this._generalService.getProcess().subscribe((res) => {
			this.processList = res.success ? res.data : [];
		});
	}

	isAdminRole() {
		return this._authService.currentRole == 'admin';
	}

	handleTabChange() {
		const tabInedx = this.matTabGroup.selectedIndex;
		this.loadClasifications(1, 5, tabInedx + 1);
	}

	loadClasifications(
		currentPage: number,
		itemsPerPage: number,
		typeClasification: number
	) {
		this._separationService
			.getRaeeByStatus(currentPage, itemsPerPage, typeClasification)
			.subscribe((response) => {
				this.totalItems = response.meta.total;
				this.itemsPerPage = response.meta.itemsPerPage;
				this.currentPage = response.meta.currentPage;
				this.clasificationList;
				response.data;
			});
	}

	openDialogComponentEdit(component?: any, index?: number) {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ComponentEditComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {
				materialList: this.materialList,
				processList: this.processList,
				component,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) this.openDialogConfirmationComponent(result, index);
		});
	}

	openDialogConfirmationComponent(component: any, index?: number): void {
		const title = 'Componente de RAEE';
		const subtitle = '¿Seguro de que deseas guardar este componente de RAEE?';
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_separar_verde_24x24.svg',
				title,
				subtitle,
				type: 'edit',
				component,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const materialIds = component.materials;
				const processIds = component.process;
				component.materials = this.materialList.filter(item => materialIds.includes(item.id)).map(material => material.name);
				component.process = this.processList.filter(item => processIds.includes(item.id)).map(process => process.name);
				if (component.component_id) {
					index = this.componentsList.findIndex(
						(item) => item.component_id === component.component_id
					);
				}

				if(index != undefined) this.componentsList[index] = component;
				else this.componentsList.push(component);


				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el componente se ha guardado con éxito.',
				});

				this.dataSource.data = this.componentsList;

				this._cdr.detectChanges();
			}
		});
	}

	openDiaglogRemoveComponent(component: RaeeComponentEdit, index?: number) {
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
				if (component.component_id) {
					this._raeeComponentsService
						.deleteComponent(component.component_id)
						.subscribe((res) => {
							if (res.success) {
								this.updateComponentList(component.component_id!);
								this.showAlert(
									'Excelente, el componente se ha eliminado con éxito.'
								);
							}
						});
				} else if (index !== undefined) {
					this.componentsList.splice(index, 1);
					this.updateDataSource();
					this.showAlert('Excelente, el componente se ha eliminado con éxito.');
				}
			}
		});
	}

	editSeparation(raee: Clasification) {
		this.isActiveSeparationView = true;
		this.raeeSelected = raee;
		this._separationService.getSeparationById(raee.id).subscribe((res) => {
			this.separation = {
				raee_id: raee.id,
				components: [],
			};

			if (res.success) {
				this.componentsList = res.data.components;
				this.dataSource.data = this.componentsList;
			}
		});
	}

	openDialogCancelSeparation() {
		const dialogRef = this._dialog.open(ConfirmationPopupComponent, {
			width: '380px',
			height: 'auto',
			autoFocus: false,
			data: {
				icon: './../../../../../assets/svg/icono_sidebar_separar_rojo_24x24.svg',
				title: 'Cancelar separación del RAEE',
				subtitle: '¿Seguro de que deseas cancelar la separación del RAEE?',
				type: 'delete',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.isActiveSeparationView = false;
				this.raeeSelected = null;
				this.componentsList = [];
				this.dataSource.data = this.componentsList;
				this._alertService.setAlert({ isActive: false, message: '' });
				this._cdr.detectChanges();
			}
		});
	}

	openDialogConfirmationSeparation() {
		const title = 'Separar RAEE';
		const subtitle = '¿Seguro de que deseas guardar la separación de este RAEE?'
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
				this.separation.components = this.componentsList.map((component) => {
					return {
						id: component.component_id,
						name: component.name,
						weight: Number(component.weight),
						dimensions: component.dimensions,
						reusable: component.reusable,
						observations: component.observations,
						materials: this.materialList.filter(item => component.materials!.includes(item.name)).map(material => material.id),
						process: this.processList.filter(item => component.process!.includes(item.name)).map(process => process.id),
					};
				});

				this._separationService.registerSeparation(this.separation).subscribe(res => {
					if(res.success){
						this._alertService.setAlert({
							isActive: true,
							message: 'Excelente, el RAEE se ha separado con éxito.',
						});
						this._cdr.detectChanges();
						this.isActiveSeparationView = false;
						this.raeeSelected = null;
						this.componentsList = [];
						this.dataSource.data = this.componentsList;
						this.loadClasifications(1, 5, 1);
					}
					else{
						this._alertService.setAlert({
							isActive: true,
							message: res.message,
							type: 'error'
						});
					}
				})


			}
		});
	}

	openDialogComponentDetail(component: any, index: number){
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ViewComponentComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				component,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogComponentEdit(component, index);
			if (result == 'delete') this.openDiaglogRemoveComponent(component, index);
		});
	}

	ngOnDestroy(): void {
		if (this.separationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.separationListSubscription.unsubscribe();
		}
	}
}
