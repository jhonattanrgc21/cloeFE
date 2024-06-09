import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-clasification-detail',
  templateUrl: './clasification-detail.component.html',
  styleUrls: ['./clasification-detail.component.scss']
})
export class ClasificationDetailComponent {
	constructor(
		public dialogRef: MatDialogRef<ClasificationDetailComponent>,
		private _authService: AuthService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onClose(option?: string): void {
		this.dialogRef.close(option);
	}

	isAdminRole() {
		return this._authService.currentRole == 'admin';
	}
}
