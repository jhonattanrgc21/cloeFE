import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	private userListSubject: BehaviorSubject<any[]> =
		new BehaviorSubject<any[]>([]);
	userList$: Observable<any[]> =
		this.userListSubject.asObservable();

	constructor() {}

	addUser(user: any): void {
		const currentList = this.userListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === user.id
		);

		if (index !== -1) currentList[index] = user;
		else currentList.push(user);
		this.userListSubject.next(currentList);
	}

	modifyStatusUser(user: any): void {
		const currentList = this.userListSubject.getValue();
		const index = currentList.findIndex(
			(item) => item.id === user.id
		);
		user.status = user.status == 'Inactivo' ? 'Activo' : 'Inactivo';
		currentList[index] = user;
		this.userListSubject.next(currentList);
	}
}
