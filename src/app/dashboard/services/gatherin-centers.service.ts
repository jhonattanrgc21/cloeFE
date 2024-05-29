import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GatheringCenter, GatheringCenterRegister, GatheringCenterUpdate } from '../interfaces/gathering-center.interface';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
	providedIn: 'root',
})
export class GatheringCentersService {
	private _gatheringCenterListSubject: BehaviorSubject<GatheringCenter[]> =
		new BehaviorSubject<GatheringCenter[]>([]);
	gatheringCenterList$: Observable<GatheringCenter[]> =
		this._gatheringCenterListSubject.asObservable();

	private _getGatheringCentersUrl: string = 'centro-acopio/index?page=';
	private _createGatheringCenterUrl: string = 'centro-acopio/store';
	private _updateGatheringCenterUrl: string = 'centro-acopio/update';

	constructor(private _httpService: HttpService) {}

	getGatheringCenters(page: number, pageSize: number) {
		return this._httpService
			.get(`${this._getGatheringCentersUrl}${page}&limit=${pageSize}`)
			.pipe(
				tap((response) => {
					if (response.success) this._gatheringCenterListSubject.next(response.data);
					else this._gatheringCenterListSubject.next([]);
				})
			);
	}

	createGatheringCenter(json: GatheringCenterRegister) {
		return this._httpService.post(this._createGatheringCenterUrl, json);
	}

	updateGatheringCenter(json: GatheringCenterUpdate) {
		const id = json.centro_id;
		delete json.centro_id;
		return this._httpService.put(this._updateGatheringCenterUrl + '/' + id, json);
	}



	addGatheringCenter(gatheringCenter: GatheringCenter): void {
		const currentList = this._gatheringCenterListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.centro_id === gatheringCenter.centro_id
		);

		if (index !== -1) currentList[index] = gatheringCenter;
		else currentList.push(gatheringCenter);
		this._gatheringCenterListSubject.next(currentList);
	}

	modifyStatusGatheringCenter(gatheringCenter: GatheringCenter): void {
		// const currentList = this._gatheringCenterListSubject.getValue();
		// const index = currentList.findIndex(
		// 	(item) => item.id === gatheringCenter.id
		// );
		// gatheringCenter.status =
		// 	gatheringCenter.status == 'Inactivo' ? 'Activo' : 'Inactivo';
		// currentList[index] = gatheringCenter;
		// this._gatheringCenterListSubject.next(currentList);
	}
}
