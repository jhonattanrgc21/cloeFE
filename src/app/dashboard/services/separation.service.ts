import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClasificationService } from './clasification.service';
import { Separation } from '../interfaces/separation.interface';

@Injectable({
  providedIn: 'root'
})
export class SeparationService {
	private _separationListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	separationList$: Observable<any[]> = this._separationListSubject.asObservable();

  constructor(private _clasificationService: ClasificationService) { }

	addSeparation(separation: Separation){
		const currentList = this._separationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.raeeId === separation.raeeId
		);

		if (index !== -1) currentList[index] = separation;
		else currentList.push(separation);

		this._separationListSubject.next(currentList);
		this._clasificationService.modifyStatus(separation.raeeId, 'Separado')
	}

	removeSeparation(raeeId: number){
		const currentList = this._separationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raeeId
		);
		currentList.splice(index, 1);
		this._separationListSubject.next(currentList);
		this._clasificationService.modifyStatus(raeeId, 'Clasificado')
	}
}
