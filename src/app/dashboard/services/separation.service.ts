import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeparationService {
	private separationListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	separationList$: Observable<any[]> = this.separationListSubject.asObservable();
	private separationObjSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	separationObj$: Observable<any> = this.separationObjSubject.asObservable();

  constructor() { }

	findByRaeeId(raeeId: number){

	}

	findAll(){

	}

	updated(separation: any){

	}

	delete(raeeId: number){
		
	}
}
