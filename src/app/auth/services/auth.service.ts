import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Login } from './../interfaces/login.interfce';
import { UserSession } from './../interfaces/current-user.interface';
import { ForgotPassword } from '../interfaces/forgot-password.interface';
import { ResetPassword } from '../interfaces/reset-password.interface';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private _logInUrl: string = 'auth/login';
	private _logOutUrl: string = 'auth/logout';
	private _refreshTokenUrl: string = 'auth/refresh-token';
	private _forgotPasswordUrl: string = 'auth/forgot-password';
	private _resetPasswordUrl: string = 'auth/reset-password';
	private _profileInfoUserUrl: string = 'auth/profile-info';
	private _currentUser!: UserSession | null | undefined;

	constructor(
		private _storageService: StorageService,
		private _httpService: HttpService
	) {}

	get currentUserSession(): UserSession | null | undefined {
		return this._currentUser;
	}

	get currentToken(): string {
		const token: string = this._storageService.getCurrentToken();
		return token ?? '';
	}

	get currentRole(): string {
		return this._currentUser
			? this._currentUser.role.toLowerCase()
			: this._storageService.getCurrentRole().toLowerCase();
	}

	get currentFullName(): string {
		let userStorage = this._storageService.getCurrentUser();
		let fullNameStorage = userStorage?.name + ' ' + userStorage?.lastname;
		return this._currentUser
			? this._currentUser.name + ' ' + this._currentUser.lastname
			: fullNameStorage;
	}

	get currentUuid(): number {
		return this._currentUser ? this._currentUser.user_id : -1;
	}

	getProfileInfo() {
		return this._httpService.get(this._profileInfoUserUrl).pipe(
			tap((response) => {
				if (response.success) {
					this._currentUser = response.user;
					this._storageService.setCurrentUser(this._currentUser);
				} else this._currentUser = null;
			})
		);
	}

	setCurrentName(newCurrentSession: UserSession) {
		this._currentUser = newCurrentSession;
		this._storageService.setCurrentUser(this._currentUser);
	}

	login(json: Login) {
		return this._httpService.post(this._logInUrl, json).pipe(
			tap((response) => {
				if (response.success) {
					this._storageService.setCurrentToken(response.token);
					this._storageService.setCurrentRole(response.role);
				}
			})
		);
	}

	logout() {
		return this._httpService.post(this._logOutUrl, {}).pipe(
			tap((response) => {
				if (response.success) {
					this._currentUser = null;
					this._storageService.removeCurrentSession();
				}
			})
		);
	}

	refreshToken() {
		return this._httpService.post(this._refreshTokenUrl, {}).pipe(
			tap((response) => {
				if (response.success) {
					this._currentUser = response.user;
					this._storageService.setCurrentSession(
						response.token,
						this._currentUser!.role,
						this._currentUser
					);
				}
			})
		);
	}

	forgotPassword(json: ForgotPassword) {
		return this._httpService.post(this._forgotPasswordUrl, json);
	}

	resetPassword(token: string, json: ResetPassword) {
		token = token.split(' ')[1];
		this._storageService.setCurrentToken(token);
		return this._httpService.post(this._resetPasswordUrl, json);
	}

	hasRole(roles: string[]): boolean {
		return roles.includes(this.currentRole);
	}
}
