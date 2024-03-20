import { Injectable } from '@angular/core';
import { GatheringCenter } from '../interfaces/gathering-center.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GatheringCentersService {
	private gatheringCenterListSubject: BehaviorSubject<GatheringCenter[]> =
		new BehaviorSubject<GatheringCenter[]>([]);
	gatheringCenterList$: Observable<GatheringCenter[]> =
		this.gatheringCenterListSubject.asObservable();

	constructor() {}

	addGatheringCenter(gatheringCenter: GatheringCenter): void {
		const currentList = this.gatheringCenterListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === gatheringCenter.id
		);

		if (index !== -1) currentList[index] = gatheringCenter;
		else currentList.push(gatheringCenter);
		this.gatheringCenterListSubject.next(currentList);
	}

	removeGatheringCenter(gatheringCenter: GatheringCenter): void {
		const currentList = this.gatheringCenterListSubject.getValue();
		const index = currentList.findIndex((item) => item.id === gatheringCenter.id);
		currentList.splice(index, 1);
		this.gatheringCenterListSubject.next(currentList);
	}
}
