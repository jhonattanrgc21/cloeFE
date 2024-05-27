import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Confirmation } from '../../interfaces/confirmation.interface';

@Component({
	selector: 'app-confirmation-popup',
	templateUrl: './confirmation-popup.component.html',
	styleUrls: ['./confirmation-popup.component.scss'],
})
export class ConfirmationPopupComponent {
	constructor(
		public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Confirmation
	) {
		console.log(data)
	}

	onClose(result?: string): void {
		this.dialogRef.close(result);
	}

	onConfirmation() {
		this.onClose('save');
	}
}
