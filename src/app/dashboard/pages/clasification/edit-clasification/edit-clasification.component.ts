import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-clasification',
  templateUrl: './edit-clasification.component.html',
  styleUrls: ['./edit-clasification.component.scss']
})
export class EditClasificationComponent {
	title: string = '';
	clasificationForm!: FormGroup;

	lineTypes: any[] = [
		{
			id: 1,
			name: 'Blanca'
		},
		{
			id: 2,
			name: 'Gris'
		},
		{
			id: 3,
			name: 'Marrón'
		}
	];

	categorties: any[] = [
		{
			id: 1,
			name: 'Cámara'
		},
		{
			id: 2,
			name: 'Equipo de oficina'
		},
		{
			id: 3,
			name: 'Juguete'
		},
		{
			id: 4,
			name: 'Laptop'
		},
		{
			id: 5,
			name: 'Otro'
		},
	];


	constructor(
		public dialogRef: MatDialogRef<EditClasificationComponent>,
		private _fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.title = data?.id ? 'Editar clasificación de RAEE': 'Clasificar RAEE';
    this.clasificationForm = this._fb.group({
			id: [data?.id],
			make: [data?.make, Validators.required],
			model: [data?.model, Validators.required],
			lineType: [data?.lineType.id, Validators.required],
			category: [data?.category.id, Validators.required],
			information: [data?.information],
		});

	}

	onClose(clasification?: any): void {
		this.dialogRef.close(clasification);
	}

	onSaveClasification(){
		const form = this.clasificationForm.value;
		const lineType = this.lineTypes.find(lineType => lineType.id == form.lineType);
		const category = this.categorties.find(category => category.id == form.category);

		if (lineType && category) {
			const clasification: any = {
				id: form.id,
				make: form.make,
				model: form.model,
				lineType: lineType,
				category: category,
				information: form.information,
			};
			this.onClose(clasification);
		}
	}
}
