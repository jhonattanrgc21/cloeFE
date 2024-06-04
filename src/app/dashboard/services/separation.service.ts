import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ClasificationService } from './clasification.service';
import { Separation } from '../interfaces/separation.interface';
import { HttpService } from 'src/app/core/services/http.service';
import { Clasification } from '../interfaces/clasification.interface';

@Injectable({
	providedIn: 'root',
})
export class SeparationService {

	private _raeeListSubject: BehaviorSubject<Clasification[]> = new BehaviorSubject<Clasification[]>([]);
	raeeList$: Observable<Clasification[]> = this._raeeListSubject.asObservable();

	private _createSeparationUrl: string = 'split/store';
	private _updateSeparationUrl: string = 'split/update';
	private _getRaeeByStatusUrl: string = 'split/index?page=';
	private _getSeparationByIdUrl: string = 'split/show/';

	constructor(
		private _clasificationService: ClasificationService,
		private _httpService: HttpService
	) {}


	getRaeeByStatus(page: number, pageSize: number, type: number){
		return this._httpService
		.get(`${this._getRaeeByStatusUrl}${page}&limit=${pageSize}&type=${type}`)
		.pipe(
			tap((response) => {
				if (response.success) this._raeeListSubject.next(response.data);
				else this._raeeListSubject.next([]);
			})
		);
	}

	registerSeparation(json: any) {
		return this._httpService.post(this._createSeparationUrl, json);
	}

	updateSeparation(json: any) {
		const id = json.id;
		delete json.id;
		return this._httpService.put(this._updateSeparationUrl + '/' + id, json);
	}

	getSeparationById(raeeId: number){
		return this._httpService.get(`${this._getSeparationByIdUrl}${raeeId}`).pipe(
      map(response => {
        if (response && response.data && response.data.components) {
          response.data.components = response.data.components.map((component: any) => {
            return {
              component_id: component.id,
              name: component.name,
              weight: component.weight,
              dimensions: component.dimensions,
              reusable: component.reusable,
              observations: component.observations,
              materials: component.materials,
              process: component.process
            };
          });
        }
        return response;
      }));
	}

	// addSeparation(separation: Separation) {
	// 	const currentList = this._separationListSubject.getValue();
	// 	const index = currentList.findIndex(
	// 		(item) => item.raee_id === separation.raee_id
	// 	);

	// 	if (index !== -1) currentList[index] = separation;
	// 	else currentList.push(separation);

	// 	this._separationListSubject.next(currentList);
	// 	this._clasificationService.modifyStatus(separation.raee_id, 'Separado');
	// }

	// removeSeparation(raeeId: number) {
	// 	const currentList = this._separationListSubject.getValue();
	// 	const index = currentList.findIndex((item) => item.id === raeeId);
	// 	currentList.splice(index, 1);
	// 	this._separationListSubject.next(currentList);
	// 	this._clasificationService.modifyStatus(raeeId, 'Clasificado');
	// }
}
