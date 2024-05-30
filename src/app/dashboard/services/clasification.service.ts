import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { ClasificationEdit, ClasificationRegister } from '../interfaces/clasification.interface';

@Injectable({
	providedIn: 'root'
})
export class ClasificationService {

	private _clasificationListSubject: BehaviorSubject<any[]> =
		new BehaviorSubject<any[]>([]);
	clasificationList$: Observable<any[]> =
		this._clasificationListSubject.asObservable();


	private _getClasificationsUrl: string = 'raee/index?page=';
	private _createClasificationUrl: string = 'raee/store';
	private _updateClasificationUrl: string = 'raee/update';
	private _deleteClasificationUrl: string = 'raee/delete';

	constructor(private _httpService: HttpService) { }

	getClasifications(page: number, pageSize: number) {
		return this._httpService
			.get(`${this._getClasificationsUrl}${page}&limit=${pageSize}`)
			.pipe(
				tap((response) => {
					if (response.success) this._clasificationListSubject.next(response.data);
					else this._clasificationListSubject.next([]);
				})
			);
	}

	createClasification(json: ClasificationRegister) {
		return this._httpService.post(this._createClasificationUrl, json);
	}

	updateClasification(json: ClasificationEdit) {
		const id = json.id;
		delete json.id;
		return this._httpService.put(this._updateClasificationUrl + '/' + id, json);
	}

	deleteClasification(raeeId: number) {
		return this._httpService.delete(this._deleteClasificationUrl, raeeId);
	}


	addClasification(raee: any): void {
		const currentList = this._clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raee.id
		);

		if (index !== -1) currentList[index] = raee;
		else currentList.push(raee);
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

	modifyStatus(raeeId: any, status: string): any {
		const currentList = this._clasificationListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === raeeId
		);
		currentList[index].status = status;
		this._clasificationListSubject.next(currentList);
	}
}
