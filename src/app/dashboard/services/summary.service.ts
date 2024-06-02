import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
	private _dataGraphUrl: string = 'dashboard';

  constructor(private _httpService: HttpService) { }

	getDataGraph(){
		return this._httpService.get(`${this._dataGraphUrl}`);
	}

}
