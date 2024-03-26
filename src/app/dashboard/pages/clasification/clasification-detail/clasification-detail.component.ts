import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-clasification-detail',
  templateUrl: './clasification-detail.component.html',
  styleUrls: ['./clasification-detail.component.scss']
})
export class ClasificationDetailComponent {
	constructor(
		public dialogRef: MatDialogRef<ClasificationDetailComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onClose(option?: string): void {
		this.dialogRef.close(option);
	}

}
