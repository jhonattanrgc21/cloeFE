import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { NewGatheringCentersPopupComponent } from './new-gathering-centers-popup/new-gathering-centers-popup.component';
import { ConfirmationGatheringCenterPopupComponent } from './confirmation-gathering-center-popup/confirmation-gathering-center-popup.component';
import { GatheringCenter } from '../../interfaces/gathering-center.interface';

@Component({
  selector: 'app-gathering-centers',
  templateUrl: './gathering-centers.component.html',
  styleUrls: ['./gathering-centers.component.scss']
})
export class GatheringCentersComponent implements OnInit {
	constructor(private _dialog: MatDialog, private viewportRuler: ViewportRuler){}

	ngOnInit(): void {
	}

	openDialogNewGatheringCenter(id?: number): void {
		const viewportSize = this.viewportRuler.getViewportSize();
		const dialogRef = this._dialog.open(NewGatheringCentersPopupComponent, {
      width: viewportSize.width < 768 ? '380px' : '474px' ,
			height: 'auto',
			autoFocus: false,
			data: {},
    });

		dialogRef.afterClosed().subscribe(result => {
			if(result) this.openDialogConfirmationGatheringCenter(result);
    });
  }

	openDialogConfirmationGatheringCenter(gatheringCenter: GatheringCenter): void {
		const dialogRef = this._dialog.open(ConfirmationGatheringCenterPopupComponent, {
      width: '380px',
			height: 'auto',
			autoFocus: false
    });

		dialogRef.afterClosed().subscribe(result => {
			if(result) console.log(`Dialog result: ${result}`);
    });
  }
}
