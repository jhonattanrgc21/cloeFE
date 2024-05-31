import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { RaeeComponent, RaeeComponentEdit } from '../interfaces/raee-component.interface';

@Injectable({
  providedIn: 'root'
})
export class RaeeComponentsService {
	private _raeeComponentListSubject: BehaviorSubject<RaeeComponent[]> = new BehaviorSubject<RaeeComponent[]>([]);
	raeeComponentList$: Observable<RaeeComponent[]> = this._raeeComponentListSubject.asObservable();

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

	updateComponent(json: RaeeComponentEdit) {
		const id = json.component_id;
		delete json.component_id;
		return this._httpService.put(this._updateComponentsUrl + '/' + id, json);
	}

	deleteComponent(componentId: number) {
		return this._httpService.delete(this._deleteComponentsUrl, componentId);
	}


	addComponent(component: RaeeComponent): void {
		const currentList = this._raeeComponentListSubject.getValue();
		const index = currentList.findIndex((item) => item.component_id === component.component_id);

		if (index !== -1) currentList[index] = component;
		else currentList.push(component);
		this._raeeComponentListSubject.next(currentList);
	}

	removeComponent(component: RaeeComponent){
		const currentList = this._raeeComponentListSubject.getValue();
		const index = currentList.findIndex((item) => item.component_id === component.component_id);
		currentList.splice(index, 1);
		this._raeeComponentListSubject.next(currentList);
	}
}
