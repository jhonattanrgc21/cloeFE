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
import { FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
	selector: 'app-separation',
	templateUrl: './separation.component.html',
	styleUrls: ['./separation.component.scss'],
})
export class SeparationComponent implements OnInit, OnDestroy {
	isActiveSeparationView: boolean = false;
	raeeSelected: any;
	separationRaeeList: any[] = [];
	componentsList: any[] = [];
	separationList: any[] = [];
	materialList: SelectionInput[] = [];
	processList: SelectionInput[] = [];
	separation!: Separation;

	clasificationList: Clasification[] = [];
	totalItems: number = 0;
	itemsPerPage = 5;
	currentPage = 1;

	private separationListSubscription!: Subscription;
	@ViewChild(MatTabGroup) matTabGroup: any;

	title = 'form-array';

	fg!: FormGroup;
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
		private _fb: FormBuilder,
		private _generalService: GeneralService,
	) {}

	ngOnInit(): void {
		this.loadClasifications(1, 5, 1);
		this._generalService.getMaterials().subscribe((res) => {
			this.materialList = res.success ? res.data : [];
		});

		this._generalService.getProcess().subscribe((res) => {
			this.processList = res.success ? res.data : [];
		});

		this.separationListSubscription =
			this._separationService.separationList$.subscribe(
				(separationsRaee: any[]) => {
					this.separationRaeeList = separationsRaee;
				}
			);
	}

	handleTabChange() {
		const tabInedx = this.matTabGroup.selectedIndex;
		this.loadClasifications(1, 5, tabInedx + 1);
	}


	loadClasifications(currentPage: number, itemsPerPage:number, typeClasification: number){
		this._separationService
			.getRaeeByStatus(currentPage, itemsPerPage, typeClasification)
			.subscribe((response) => {
				this.totalItems = response.meta.total;
				this.itemsPerPage = response.meta.itemsPerPage;
				this.currentPage = response.meta.currentPage;
				this.clasificationList; response.data
			});
	}

	openDialogComponentEdit(component?: RaeeComponent) {
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
			if (result) this.openDialogConfirmationComponent(result);
		});
	}

	openDialogConfirmationComponent(component: RaeeComponentEdit): void {
		const title = component.component_id
			? 'Editar componente de RAEE'
			: 'Componente de RAEE';
		const subtitle = component.component_id
			? '¿Seguro de que deseas editar esta componente de RAEE?'
			: '¿Seguro de que deseas registrar este componente de RAEE?';
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
				if (!component.component_id) component.component_id = this.componentsList.length + 1;

				const index = this.componentsList.findIndex(
					(item) => item.id === component.component_id
				);

				let message = '';
				if (index !== -1) {
					this.componentsList[index] = component;
					message = 'Excelente, el componente se ha registrado con éxito.';
				} else {
					this.componentsList.push(component);
					message = 'Excelente, el componente se ha editado con éxito.';
				}

				this._alertService.setAlert({
					isActive: true,
					message,
				});
				this.dataSource.data = this.componentsList;

				this._cdr.detectChanges();
			}
		});
	}

	openDiaglogRemoveComponent(component: any) {
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
				const index = this.componentsList.findIndex(
					(item) => item.id === component.id
				);
				this.componentsList.splice(index, 1);
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el componente se ha eliminado con éxito.',
				});

				this.dataSource.data = this.componentsList;
				this._cdr.detectChanges();
			}
		});
	}

	editSeparation(raee: Clasification) {
		this.isActiveSeparationView = true;
		this.raeeSelected = raee;

		// Agregar peticion a backend par aobtener datos del RAEE
		this._separationService.getSeparationById(raee.id).subscribe(res => {
			if(res.success){
				this.componentsList = res.data.components;
				this.dataSource.data = this.componentsList;
			}
			else{
				this.separation = {
					raeeId: raee.id,
					components: [],
					observation: '',
				};
				this.separation.raeeId = raee.id;
			}
		})

		// this.separation = this.separationRaeeList.find(
		// 	(separation) => separation.raeeId == raee.id
		// );
		// if (this.separation) {
		// 	this.fg = this._fb.group({
		// 		observation: [
		// 			this.separation.observation,
		// 			this._generalService.noWhitespaceValidator(),
		// 		],
		// 	});
		// 	this.componentsList = this.separation.components;
		// 	this.dataSource.data = this.componentsList;
		// } else {
		// 	this.separation = {
		// 		raeeId: raee.id,
		// 		components: [],
		// 		observation: '',
		// 	};
		// 	this.separation.raeeId = raee.id;
		// 	this.fg = this._fb.group({
		// 		observation: [, this._generalService.noWhitespaceValidator()],
		// 	});
		// }
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
		const title = this.separation.id
			? 'Editar separación de RAEE'
			: 'Separar RAEE';
		const subtitle = this.separation.id
			? '¿Seguro de que deseas editar la separación de este RAEE?'
			: '¿Seguro de que deseas separar este RAEE?';
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
				this.separation.components = this.componentsList;
				this.separation.observation = this.fg.value.observation;
				this._separationService.addSeparation(this.separation);
				this._alertService.setAlert({
					isActive: true,
					message: 'Excelente, el RAEE se ha separado con éxito.',
				});
				this._cdr.detectChanges();
				this.isActiveSeparationView = false;
				this.raeeSelected = null;
				this.componentsList = [];
				this.dataSource.data = this.componentsList;
			}
		});
	}

	openDialogComponentDetail(component: any){
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ViewComponentComponent, {
			width: viewportSize.width < 768 ? '380px' : '479px',
			height: 'auto',
			autoFocus: false,
			data: {
				name: component,
				materials: this.getNames(this.materialList, component.materials),
				process: this.getNames(this.processList, component.process),
				weight: component.weight,
				dimensions: component.dimensions,
				reutilizable: component.reutilizable,
				comment: component.comment?? ''
			}
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result == 'edit') this.openDialogComponentEdit(component);
			if (result == 'delete') this.openDiaglogRemoveComponent(component);
		});
	}

	getNames(list: any[], ids: number[]) {
		const objetosFiltrados = list.filter((item) => ids.includes(item.id));
		const nombres = objetosFiltrados.map((objeto) => objeto.name).join(', ');
		return nombres;
	}

	ngOnDestroy(): void {
		if (this.separationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.separationListSubscription.unsubscribe();
		}
	}
}
