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

	constructor(
		public dialogRef: MatDialogRef<ComponentEditComponent>,
		private _fb: FormBuilder,
		private _generalService: GenerarlService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.title = data?.id ? 'Editar componente de RAEE' : 'Componente RAEE';
		this.componentForm = this._fb.group({
			name: [
				'',
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			materials: [
				[],
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			process: [
				[],
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			weight: [
				'',
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			dimensions: ['', this._generalService.noWhitespaceValidator()],
			reutilizable: [
				false,
				[Validators.required, this._generalService.noWhitespaceValidator()],
			],
			comment: [, this._generalService.noWhitespaceValidator()],
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
				reusable: form.reusable,
				materials: form.materials,
				process: form.process,
				comment: form.comment ? form.comment.trim() : null,
			};
			this.onClose(component);
		}
	}
}
