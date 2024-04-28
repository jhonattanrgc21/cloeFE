import { ClasificationService } from './clasification.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeparationService {
	private separationListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	separationList$: Observable<any[]> = this.separationListSubject.asObservable();

  constructor(private _clasificationService: ClasificationService) { }

	addSeparation(separation: any){
		const currentList = this.separationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === separation.raeeId
		);

		this.separationListSubject.next(currentList);
		if (index !== -1) currentList[index] = separation;
		else currentList.push(separation);
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
