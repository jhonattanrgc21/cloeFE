import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.component.html',
  styleUrls: ['./received-message.component.scss']
})
export class ReceivedMessageComponent {
	constructor(
		public dialogRef: MatDialogRef<ReceivedMessageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onClose(result: string): void {
		this.dialogRef.close(result);
	}

	onAcept() {
		this.onClose('save');
	}
}
