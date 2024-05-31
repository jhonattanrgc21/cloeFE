import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RaeeComponent, RaeeComponentEdit } from 'src/app/dashboard/interfaces/raee-component.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
	selector: 'app-component-edit',
	templateUrl: './component-edit.component.html',
	styleUrls: ['./component-edit.component.scss'],
})
export class ComponentEditComponent implements OnInit {
	title: string = '';
	length?: string;
	width?: string;
	height?: string;
	componentForm!: FormGroup;

	materialList: SelectionInput[];
	processList: SelectionInput[];

	constructor(
		public dialogRef: MatDialogRef<ComponentEditComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.materialList = data.materialList;
		this.processList = data.processList;

		if(data && data.component){
			const dimensions = data.component.dimensions.split('x');
			this.length = dimensions[0];
			this.width = dimensions[1];
			this.height = dimensions[2];
		}

		this.componentForm = this._fb.group({
			id: [],
			name: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			materials: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			process: [
				,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			weight: [
				data?.component?.weight,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			length: [, this._generalService.noWhitespaceValidator()],
			width: [, this._generalService.noWhitespaceValidator()],
			height: [, this._generalService.noWhitespaceValidator()],
			reutilizable: [
				data.component ? data.component.reutilizable : false,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			comment: [
				data?.component?.comment,
				this._generalService.noWhitespaceValidator(),
			],
		});
	}
	ngOnInit(): void {
		const component: RaeeComponent = this.data.component;
		if(!component) 	this.title =  'Registrar componente RAEE';
		else{
			this.title = 'Editar componente de RAEE';
			this.componentForm.patchValue({
				id: component.component_id,
				name: component.name,
				weight: component.weight,
				length: this.length,
				width: this.width,
				height: this.height,
				reutilizable: component.reusable,
				comment: component.observations
			});
			const materials = this.materialList.filter(item => component.materials.includes(item.name));
			let materialIds = materials.map(item => item.id);
			let process = this.processList.filter(item => component.process.includes(item.name));
			let processIds = process.map(item => item.id);
			this.componentForm.get('materials')?.setValue(materialIds);
			this.componentForm.get('process')?.setValue(processIds);
		}
	}

	onClose(clasification?: any): void {
		this.dialogRef.close(clasification);
	}

	onSaveComponent() {
		let form = this.componentForm.value;
		const materials = this.materialList.filter((material) =>
			form.materials.includes(material.id)
		);
		const process = this.processList.filter((process) =>
			form.process.includes(process.id)
		);

		if (materials && process) {
			const component: RaeeComponentEdit = {
				component_id: form.id,
				name: form.name.trim(),
				weight: form.weight,
				dimensions: (form.length + 'x' + form.width + 'x' + form.height).replace('.', ','),
				reusable: form.reutilizable,
				materials: form.materials,
				process: form.process,
				observations: form.comment
			};
			this.onClose(component);
		}
	}
}
