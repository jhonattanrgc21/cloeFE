import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GatheringCenter } from '../interfaces/gathering-center.interface';

@Injectable({
	providedIn: 'root',
})
export class GatheringCentersService {
	private _gatheringCenterListSubject: BehaviorSubject<GatheringCenter[]> =
		new BehaviorSubject<GatheringCenter[]>([]);
	gatheringCenterList$: Observable<GatheringCenter[]> =
		this._gatheringCenterListSubject.asObservable();

	private _getUsersUrl: string = 'users/index?page=';
	private _createUserUrl: string = 'users/register';
	private _updateUserUrl: string = 'users/update';

	constructor() {}

	addGatheringCenter(gatheringCenter: GatheringCenter): void {
		const currentList = this._gatheringCenterListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === gatheringCenter.id
		);

		if (index !== -1) currentList[index] = gatheringCenter;
		else currentList.push(gatheringCenter);
		this._gatheringCenterListSubject.next(currentList);
	}

	modifyStatusGatheringCenter(gatheringCenter: GatheringCenter): void {
		const currentList = this._gatheringCenterListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === gatheringCenter.id
		);
		gatheringCenter.status =
			gatheringCenter.status == 'Inactivo' ? 'Activo' : 'Inactivo';
		currentList[index] = gatheringCenter;
		this._gatheringCenterListSubject.next(currentList);
	}
}
