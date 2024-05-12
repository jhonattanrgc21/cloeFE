import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasificationService {

	private _clasificationListSubject: BehaviorSubject<any[]> =
		new BehaviorSubject<any[]>([]);
	clasificationList$: Observable<any[]> =
		this._clasificationListSubject.asObservable();

	constructor() {}

	addClasification(raee: any): void {
		const currentList = this._clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raee.id
		);

		if (index !== -1) currentList[index] = raee;
		//else currentList.push(raee);
		else{
			raee.id = currentList.length + 1;
			currentList.push(raee);
		}
		this._clasificationListSubject.next(currentList);
	}

	removeClasification(raee: any): void {
		const currentList = this._clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raee.id
		);
		currentList.splice(index, 1);
		this._clasificationListSubject.next(currentList);
	}

	modifyStatus(raeeId: any, status: string): any{
		const currentList = this._clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raeeId
		);
		currentList[index].status = status;
		this._clasificationListSubject.next(currentList);
	}
}
