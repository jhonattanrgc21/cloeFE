import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasificationService {

	private clasificationListSubject: BehaviorSubject<any[]> =
		new BehaviorSubject<any[]>([]);
	clasificationList$: Observable<any[]> =
		this.clasificationListSubject.asObservable();

	constructor() {}

	addClasification(raee: any): void {
		const currentList = this.clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raee.id
		);

		if (index !== -1) currentList[index] = raee;
		else currentList.push(raee);
		this.clasificationListSubject.next(currentList);
	}

	removeClasification(raee: any): void {
		const currentList = this.clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raee.id
		);
		currentList.splice(index, 1);
		this.clasificationListSubject.next(currentList);
	}
}
