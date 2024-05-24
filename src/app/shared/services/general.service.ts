import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SelectionInput } from '../interfaces/selection-input.interface';
import { HttpService } from 'src/app/core/services/http.service';
import { SelectFilter } from '../interfaces/filters.interface';
import { GatheringCenterCard } from 'src/app/landing/interfaces/gathering-center.interface';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
	private _statesList: BehaviorSubject<any[]> = new BehaviorSubject<SelectionInput[]>([]);
	statesList$: Observable<SelectionInput[]> = this._statesList.asObservable();

	private _citiesList: BehaviorSubject<any[]> = new BehaviorSubject<SelectionInput[]>([]);
	citiesList$: Observable<SelectionInput[]> = this._citiesList.asObservable();

	private _linesList: BehaviorSubject<any[]> = new BehaviorSubject<SelectionInput[]>([]);
	linesList$: Observable<SelectionInput[]> = this._linesList.asObservable();

	private _categoriesList: BehaviorSubject<any[]> = new BehaviorSubject<SelectionInput[]>([]);
	categoriesList$: Observable<SelectionInput[]> = this._categoriesList.asObservable();

	private _brandsList: BehaviorSubject<any[]> = new BehaviorSubject<SelectionInput[]>([]);
	brandsList$: Observable<SelectionInput[]> = this._brandsList.asObservable();

	private _gatheringCentersList: BehaviorSubject<any[]> = new BehaviorSubject<GatheringCenterCard[]>([]);
	gatheringCenterList$: Observable<GatheringCenterCard[]> = this._gatheringCentersList.asObservable();

	private _getStatesUrl: string = 'utils/estados';
	private _getCitiesUrl: string = 'utils/ciudades';
	private _getLinesUrl: string = 'utils/lines';
	private _getCategoriesUrl: string = 'utils/categories';
	private _getBrandsUrl: string = 'utils/brands';
	private _getGatheringCentersUrl: string = 'utils/centros';

  constructor(private _httpService: HttpService) { }

	noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^(?!\s*$).+/i.test(control.value);
      return isValid ? null : { 'required': true };
    };
  }

	getStates(){
		return this._httpService
			.get(this._getStatesUrl)
	}

	getCities(json: SelectFilter){
		return this._httpService
			.post(this._getCitiesUrl, json )
	}

	getLines(){
		return this._httpService
			.get(this._getLinesUrl)
			.pipe(
				tap((response) => {
					if (response.success) this._linesList.next(response.data);
					else this._linesList.next([]);
				})
			);
	}

	getCategories(){
		return this._httpService
			.get(this._getCategoriesUrl)
			.pipe(
				tap((response) => {
					if (response.success) this._categoriesList.next(response.data);
					else this._categoriesList.next([]);
				})
			);
	}

	getBrands(){
		return this._httpService
			.get(this._getBrandsUrl)
			.pipe(
				tap((response) => {
					if (response.success) this._brandsList.next(response.data);
					else this._brandsList.next([]);
				})
			);
	}
	getGatheringCenters(json: SelectFilter){
		return this._httpService
			.post(this._getGatheringCentersUrl, json )
			.pipe(
				tap((response) => {
					if (response.success) this._gatheringCentersList.next(response.data);
					else this._gatheringCentersList.next([]);
				})
			);
	}
}
