import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-desablet-gathering-center-popup',
  templateUrl: './desablet-gathering-center-popup.component.html',
  styleUrls: ['./desablet-gathering-center-popup.component.scss']
})
export class DesabletGatheringCenterPopupComponent {
	constructor(public dialogRef: MatDialogRef<DesabletGatheringCenterPopupComponent>){}

	onClose(result?: string): void {
		this.dialogRef.close(result);
	}

	onConfirmDesabletGatheringCenter(){
		this.onClose('save');
	}
}
