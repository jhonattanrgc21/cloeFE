import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gathering-center-detail',
  templateUrl: './gathering-center-detail.component.html',
  styleUrls: ['./gathering-center-detail.component.scss']
})
export class GatheringCenterDetailComponent {
	constructor(
		public dialogRef: MatDialogRef<GatheringCenterDetailComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onClose(option?: string): void {
		this.dialogRef.close(option);
	}
}
