import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserEdit, UserRegister } from '../interfaces/users.interface';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	private _userListSubject: BehaviorSubject<User[]> = new BehaviorSubject<
		User[]
	>([]);
	userList$: Observable<User[]> = this._userListSubject.asObservable();
	private _getUsersUrl: string = 'users/index?page=';
	private _createUserUrl: string = 'users/register';
	private _updateUserUrl: string = 'users/update';

	constructor(private _httpService: HttpService) {}

	getUsers(page: number, pageSize: number) {
		return this._httpService
			.get(`${this._getUsersUrl}${page}&limit=${pageSize}`)
			.pipe(
				tap((response) => {
					if (response.success) this._userListSubject.next(response.data);
					else this._userListSubject.next([]);
				})
			);
	}

	createUser(json: UserRegister) {
		return this._httpService.post(this._createUserUrl, json);
	}

	updateUser(json: UserEdit) {
		delete json.id;
		return this._httpService.put(this._updateUserUrl + '/' + json.id, json);
	}

	addUser(user: User): void {
		const currentList = this._userListSubject.getValue();
		const index = currentList.findIndex((item) => item.id === user.id);

		if (index !== -1) currentList[index] = user;
		else currentList.push(user);
		this._userListSubject.next(currentList);
	}

	modifyStatusUser(user: User): void {
		const currentList = this._userListSubject.getValue();
		const index = currentList.findIndex((item) => item.id === user.id);
		user.active = user.active == 1 ? 0 : 1;
		currentList[index] = user;
		this._userListSubject.next(currentList);
	}
}
