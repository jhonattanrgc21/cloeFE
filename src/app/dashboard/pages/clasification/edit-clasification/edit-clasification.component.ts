import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clasification, ClasificationEdit } from 'src/app/dashboard/interfaces/clasification.interface';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'app-edit-clasification',
  templateUrl: './edit-clasification.component.html',
  styleUrls: ['./edit-clasification.component.scss']
})
export class EditClasificationComponent implements OnInit{
	title: string = '';
	clasificationForm!: FormGroup;
	brandId?: number;
	categoryId?: number;
	lineId?: number;
	brandsList: SelectionInput[] = [];
	categoriesList: SelectionInput[] = [];
	linesList: SelectionInput[] = [];


	constructor(
		public dialogRef: MatDialogRef<EditClasificationComponent>,
		private _fb: FormBuilder,
		private _generalService: GeneralService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.brandsList = this.data.brandsList;
		this.categoriesList = this.data.categoriesList;
		this.linesList = this.data.linesList;

		this.clasificationForm = this._fb.group({
			id: [],
			model: [, [Validators.required, this._generalService.noWhitespaceValidator()]],
			brand_id: [, Validators.required],
			line_id: [, Validators.required],
			category_id: [, Validators.required],
			information: [],
		});

	}

	ngOnInit(): void {
		const clasificación: Clasification = this.data.clasification;
		if (!clasificación) {
			this.title =  'Clasificar RAEE';
		} else {
			this.title = 'Editar clasificación de RAEE';
			this.clasificationForm.patchValue({
				id: clasificación.id,
				model: clasificación.model,
				information: clasificación.information,
			});
			this.brandId = this.brandsList.find(
				(item) => item.name.toLowerCase() === clasificación.brand.toLowerCase()
			)?.id;
			this.clasificationForm.get('brand_id')?.setValue(this.brandId);

			this.categoryId = this.categoriesList.find(
				(item) => item.name.toLowerCase() === clasificación.categoria.toLowerCase()
			)?.id;
			this.clasificationForm.get('category_id')?.setValue(this.categoryId);

			this.lineId = this.linesList.find(
				(item) => item.name.toLowerCase() === clasificación.linea.toLowerCase()
			)?.id;
			this.clasificationForm.get('line_id')?.setValue(this.lineId);
		}
	}


	onClose(clasificationEdit?: ClasificationEdit ): void {
		this.dialogRef.close(clasificationEdit);
	}

	onSaveClasification(){
		let clasificationEdit: ClasificationEdit = this.clasificationForm.value;
		clasificationEdit.model = clasificationEdit.model?.trim();
		clasificationEdit.information = clasificationEdit.information?.trim();
		this.onClose(clasificationEdit);
	}
}
