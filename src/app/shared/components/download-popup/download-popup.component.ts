import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-download-popup',
  templateUrl: './download-popup.component.html',
  styleUrls: ['./download-popup.component.scss']
})
export class DownloadPopupComponent {
	downloadForm!: FormGroup;
	options: any[] = [
		{
			id: 1,
			name: 'Libro de Excel'
		},
		{
			id: 2,
			name: 'PDF'
		}
	]

	constructor(
		public dialogRef: MatDialogRef<DownloadPopupComponent>,
		private _fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.downloadForm = this._fb.group({
			id: [, Validators.required],
		});
	}

	onClose(id?: number): void {
		this.dialogRef.close(id);
	}

	onConfirmation() {
		const form = this.downloadForm.value;
		this.onClose(form.id);
	}
}
