import { Injectable } from '@angular/core';
import { GatheringCenter } from '../interfaces/gathering-center.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GatheringCentersService {

  private gatheringCenterListSubject: BehaviorSubject<GatheringCenter[]> = new BehaviorSubject<GatheringCenter[]>([]);
  gatheringCenterList$: Observable<GatheringCenter[]> = this.gatheringCenterListSubject.asObservable();

  constructor() { }

  setGatheringCenterList(gatheringCenters: GatheringCenter[]): void {
    this.gatheringCenterListSubject.next(gatheringCenters);
  }

  addGatheringCenter(gatheringCenter: GatheringCenter): void {
    const currentList = this.gatheringCenterListSubject.getValue();
    currentList.push(gatheringCenter);
    this.gatheringCenterListSubject.next(currentList);
  }
}
