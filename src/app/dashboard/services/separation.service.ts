import { ClasificationService } from './clasification.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Separation } from '../interfaces/separation.interface';

@Injectable({
  providedIn: 'root'
})
export class SeparationService {
	private separationListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	separationList$: Observable<any[]> = this.separationListSubject.asObservable();

  constructor(private _clasificationService: ClasificationService) { }

	addSeparation(separation: Separation){
		const currentList = this.separationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.raeeId === separation.raeeId
		);

		if (index !== -1) currentList[index] = separation;
		else currentList.push(separation);

		this.separationListSubject.next(currentList);
		this._clasificationService.modifyStatus(separation.raeeId, 'Separado')
	}

	removeSeparation(raeeId: number){
		const currentList = this.separationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raeeId
		);
		currentList.splice(index, 1);
		this.separationListSubject.next(currentList);
		this._clasificationService.modifyStatus(raeeId, 'Clasificado')
	}
}
