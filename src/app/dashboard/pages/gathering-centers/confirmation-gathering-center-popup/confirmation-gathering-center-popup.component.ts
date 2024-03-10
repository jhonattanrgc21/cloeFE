import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-gathering-center-popup',
  templateUrl: './confirmation-gathering-center-popup.component.html',
  styleUrls: ['./confirmation-gathering-center-popup.component.scss']
})
export class ConfirmationGatheringCenterPopupComponent {
	constructor(public dialogRef: MatDialogRef<ConfirmationGatheringCenterPopupComponent>){}

	onClose(result?: string): void {
		this.dialogRef.close(result);
	}

	onConfirmGatheringCenter(){
		this.onClose('save');
	}
}

