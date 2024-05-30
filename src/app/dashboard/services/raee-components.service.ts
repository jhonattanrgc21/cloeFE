import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class RaeeComponentsService {
	private _raeeComponentListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	raeeComponentList$: Observable<any[]> = this._raeeComponentListSubject.asObservable();

	private _getComponentsUrl: string = 'components/index?page=';
	private _updateComponentsUrl: string = 'components/update';
	private _deleteComponentsUrl: string = 'components/delete';

	constructor(private _httpService: HttpService) {}

	getComponents(page: number, pageSize: number) {
		return this._httpService
			.get(`${this._getComponentsUrl}${page}&limit=${pageSize}`)
			.pipe(
				tap((response) => {
					if (response.success) this._raeeComponentListSubject.next(response.data);
					else this._raeeComponentListSubject.next([]);
				})
			);
	}

	updateComponent(json: any) {
		const id = json.id;
		delete json.id;
		return this._httpService.put(this._updateComponentsUrl + '/' + id, json);
	}

	deleteComponent(componentId: number) {
		return this._httpService.delete(this._deleteComponentsUrl, componentId);
	}


	addComponent(component: any): void {
		const currentList = this._raeeComponentListSubject.getValue();
		const index = currentList.findIndex((item) => item.id === component.id);

		if (index !== -1) currentList[index] = component;
		else currentList.push(component);
		this._raeeComponentListSubject.next(currentList);
	}

	removeComponent(component: any){
		const currentList = this._raeeComponentListSubject.getValue();
		const index = currentList.findIndex((item) => item.id === component.id);
		currentList.splice(index, 1);
		this._raeeComponentListSubject.next(currentList);
	}
}
