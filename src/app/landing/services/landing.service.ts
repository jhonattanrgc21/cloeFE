import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { SendMessage } from '../interfaces/contacts.interface';

@Injectable({
	providedIn: 'root',
})
export class LandingService {
	private _contactUrl = 'utils/contact';

	constructor(private _httpService: HttpService) {}

	sendMessage(json: SendMessage) {
		return this._httpService.post(this._contactUrl, json);
	}
}
