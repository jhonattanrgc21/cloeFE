import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenerarlService } from 'src/app/shared/services/generarl.service';

@Component({
	selector: 'app-component-edit',
	templateUrl: './component-edit.component.html',
	styleUrls: ['./component-edit.component.scss'],
})
export class ComponentEditComponent {
	title: string = '';
	componentForm!: FormGroup;

	materialList: any[];
	processList: any[];

	constructor(
		public dialogRef: MatDialogRef<ComponentEditComponent>,
		private _fb: FormBuilder,
		private _generalService: GenerarlService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.title = data?.id ? 'Editar componente de RAEE' : 'Componente RAEE';
		this.materialList = data.materialList;
		this.processList = data.processList;

		this.componentForm = this._fb.group({
			id: [
				data?.component?.id,
			],
			name: [
				data?.component?.name,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			materials: [
				data?.component?.materials,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			process: [
				data?.component?.process,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			weight: [
				data?.component?.weight,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			dimensions: [data?.component?.dimensions, this._generalService.noWhitespaceValidator()],
			reutilizable: [
				data.component? data.component.reutilizable: false,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			comment: [data?.component?.comment, this._generalService.noWhitespaceValidator()],
		});
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
			const component: any = {
				id: form.id,
				name: form.name.trim(),
				weight: form.weight.trim(),
				dimensions: form.dimensions.trim(),
				reutilizable: form.reutilizable,
				materials: form.materials,
				process: form.process,
				comment: form.comment ? form.comment.trim() : null,
			};
			this.onClose(component);
		}
	}
}
