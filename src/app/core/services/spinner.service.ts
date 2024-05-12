import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

	constructor(private _spinnerService: NgxSpinnerService) {}

	show(): void {
		this._spinnerService.show();
	}

	hide(): void {
		this._spinnerService.hide();
	}
}
