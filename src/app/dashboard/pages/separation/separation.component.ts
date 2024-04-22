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
import { ClasificationService } from '../../services/clasification.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTabGroup } from '@angular/material/tabs';
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GenerarlService } from 'src/app/shared/services/generarl.service';
import { ComponentEditComponent } from './component-edit/component-edit.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';

@Component({
	selector: 'app-separation',
	templateUrl: './separation.component.html',
	styleUrls: ['./separation.component.scss'],
})
export class SeparationComponent implements OnInit, OnDestroy {
	isActiveSeparationView: boolean = false;
	raeeSelected: any;
	clasificationAllList: any[] = [];
	clasificationList: any[] = [];
	componentsList: any[] = [];
	separationList: any[] = [];
	materialList: any[] = [
		{
			id: 1,
			name: 'Plastico',
		},
		{
			id: 2,
			name: 'Metal',
		},
		{
			id: 3,
			name: 'Vidrio',
		},
		{
			id: 4,
			name: 'Otros',
		},
	];

	processList: any[] = [
		{
			id: 1,
			name: 'Proceso 1',
		},
		{
			id: 2,
			name: 'Proceso 2',
		},
		{
			id: 3,
			name: 'Proceso 3',
		},
	];

	private clasificationListSubscription!: Subscription;
	@ViewChild(MatTabGroup) matTabGroup: any;

	title = 'form-array';

	fg!: FormGroup;
	dataSourcePacks!: MatTableDataSource<any>;
	displayedColumns = [
		'component',
		'materials',
		'process',
		'weight',
		'dimensions',
		'reutilizable',
		'actions',
	];

	constructor(
		private _clasificationService: ClasificationService,
		private _viewportRuler: ViewportRuler,
		private _dialog: MatDialog,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _fb: FormBuilder,
		private _generalService: GenerarlService
	) {}

	ngOnInit(): void {
		this.clasificationListSubscription =
			this._clasificationService.clasificationList$.subscribe(
				(clasifications: any[]) => {
					this.clasificationAllList = clasifications;
					this.clasificationList = this.clasificationAllList.filter(
						(elem) => elem.status == 'Clasificado'
					);
					this.separationList = this.clasificationAllList.filter(
						(elem) => elem.status == 'Separado'
					);
				}
			);
	}

	openDialogComponentEdit(component?: any) {
		const viewportSize = this._viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(ComponentEditComponent, {
			width: viewportSize.width < 768 ? '380px' : '474px',
			height: '500px',
			autoFocus: false,
			data: {
				materialList: this.materialList,
				processList: this.processList,
				component
			}
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) this.openDialogConfirmationComponent(result);
		});
	}

	openDialogConfirmationComponent(component: any): void {
		const title = component.id
			? 'Editar componente de RAEE'
			: 'Componente de RAEE';
		const subtitle = component.id
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
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// TODO: agregar peticion al backend para guardar el registro
				// const json: any = {
				// 	id: clasification.id,
				// 	make: clasification.make,
				// 	model: clasification.model,
				// 	lineTypeId: clasification.lineType.id,
				// 	categoryId: clasification.category.id,
				// 	information: clasification.information,
				// };

				// clasification.status = 'Clasificado';

				// this._clasificationService.addClasification(clasification);
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
				// this._clasificationService.removeClasification(clasification);
				this._cdr.detectChanges();
			}
		});
	}

	newSeparation(raee: any) {
		this.isActiveSeparationView = true;
		this.raeeSelected = raee;
		this.fg = this._fb.group({
			observation: this._fb.group([
				,
				this._generalService.noWhitespaceValidator(),
			]),
		});
	}

	editSeparation(raee: any) {
		this.isActiveSeparationView = true;
		this.raeeSelected = raee;
	}

	cancelSeparation() {
		this.isActiveSeparationView = false;
		this.raeeSelected = null;
	}

	ngOnDestroy(): void {
		if (this.clasificationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.clasificationListSubscription.unsubscribe();
		}
	}
}
