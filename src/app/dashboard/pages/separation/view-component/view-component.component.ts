import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-component',
  templateUrl: './view-component.component.html',
  styleUrls: ['./view-component.component.scss']
})
export class ViewComponentComponent {
	constructor(
		public dialogRef: MatDialogRef<ViewComponentComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	getNames(list: string[]){
		return list.join(', ');
	}

	onClose(option?: string): void {
		this.dialogRef.close(option);
	}
}
