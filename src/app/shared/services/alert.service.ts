import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '../interfaces/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

	private alertSubject: BehaviorSubject<Alert> = new BehaviorSubject<Alert>({isActive: false, message: ''});
  alert$: Observable<Alert> = this.alertSubject.asObservable();

  constructor() {}

	setAlert(alertObj: Alert): void {
		this.alertSubject.next(alertObj);
	}

	// getMessage(): string {
	//   return this.message;
	// }


	// isOpened(): boolean {
	//   return this.isOpen;
	// }
}

