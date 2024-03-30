import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ClasificationService } from '../../services/clasification.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
	selector: 'app-separation',
	templateUrl: './separation.component.html',
	styleUrls: ['./separation.component.scss'],
})
export class SeparationComponent implements OnInit, OnDestroy {
	clasificationAllList: any[] = [];
	clasificationList: any[] = [];
	separationList: any[] = [];
	private clasificationListSubscription!: Subscription;
	@ViewChild(MatTabGroup) matTabGroup: any;

	constructor(
		private _dialog: MatDialog,
		private _viewportRuler: ViewportRuler,
		private _clasificationService: ClasificationService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService
	) {}

	ngOnInit(): void {
		this.clasificationListSubscription =
			this._clasificationService.clasificationList$.subscribe(
				(clasifications: any[]) => {
					this.clasificationAllList = clasifications;
					this.clasificationList = this.clasificationAllList.filter(
						(elem) => elem.status == 'Clasificado'
					);
					this.separationList = this.clasificationAllList.filter(
						(elem) => elem.status == 'Separado'
					);
				}
			);
	}

	ngOnDestroy(): void {
		if (this.clasificationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.clasificationListSubscription.unsubscribe();
		}
	}
}
