import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-detail-popup',
  templateUrl: './user-detail-popup.component.html',
  styleUrls: ['./user-detail-popup.component.scss']
})
export class UserDetailPopupComponent {
	constructor(
		public dialogRef: MatDialogRef<UserDetailPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onClose(option?: string): void {
		this.dialogRef.close(option);
	}
}
