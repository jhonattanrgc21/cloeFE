import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { SelectFilter } from '../interfaces/filters.interface';
import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class GeneralService {
	private _getStatesUrl: string = 'utils/estados';
	private _getCitiesUrl: string = 'utils/ciudades';
	private _getLinesUrl: string = 'utils/lines';
	private _getCategoriesUrl: string = 'utils/categories';
	private _getBrandsUrl: string = 'utils/brands';
	private _getGatheringCentersUrl: string = 'utils/centros';
	private _getPdfUrl: string = 'users/report-pdf';
	private _getExcelUrl: string = 'users/report-excel';

	constructor(private _httpService: HttpService) {}

	noWhitespaceValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const isValid = /^(?!\s*$).+/i.test(control.value);
			return isValid ? null : { required: true };
		};
	}

	getStates() {
		return this._httpService.get(this._getStatesUrl);
	}

	getCities(json: SelectFilter) {
		return this._httpService.post(this._getCitiesUrl, json);
	}

	getLines() {
		return this._httpService.get(this._getLinesUrl)
	}

	getCategories() {
		return this._httpService.get(this._getCategoriesUrl)
	}

	getBrands() {
		return this._httpService.get(this._getBrandsUrl);
	}

	getGatheringCenters(json: SelectFilter | null ) {
		return this._httpService.post(this._getGatheringCentersUrl, json)
	}

	getDocument(name: string, type: string) {
		const url: string = type == 'application/pdf' ? this._getPdfUrl : this._getExcelUrl;
				this._httpService.getDocument(url).subscribe((data: Blob) => {
			const blob = new Blob([data], { type });
			saveAs(blob, name);
		});
	}
}
