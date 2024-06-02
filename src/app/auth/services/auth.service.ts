import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
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
	private _currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  currentUser$ = this._currentUserSubject.asObservable();


	constructor(
		private _storageService: StorageService,
		private _httpService: HttpService
	) {}

	get currentUserSession(): UserSession | null | undefined {
    return this._currentUserSubject.value;
  }

	get currentToken(): string {
		const token: string = this._storageService.getCurrentToken();
		return token ?? '';
	}

  get currentRole(): string {
    const currentUser = this._currentUserSubject.value;
    return currentUser
      ? currentUser.role.toLowerCase()
      : this._storageService.getCurrentRole().toLowerCase();
  }

  get currentFullName(): string {
    const currentUser = this._currentUserSubject.value;
    let userStorage = this._storageService.getCurrentUser();
    let fullNameStorage = userStorage?.name + ' ' + userStorage?.lastname;
    return currentUser
      ? currentUser.name + ' ' + currentUser.lastname
      : fullNameStorage;
  }

  get currentUuid(): number {
    const currentUser = this._currentUserSubject.value;
    return currentUser ? currentUser.user_id : -1;
  }

  getProfileInfo() {
    return this._httpService.get(this._profileInfoUserUrl).pipe(
      tap((response) => {
        if (response.success) {
          this._currentUserSubject.next(response.user);
          this._storageService.setCurrentUser(response.user);
        } else {
          this._currentUserSubject.next(null);
        }
      })
    );
  }

  setCurrentUser(newCurrentSession: UserSession) {
    this._currentUserSubject.next(newCurrentSession);
    this._storageService.setCurrentUser(newCurrentSession);
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
					this._currentUserSubject.next(null);
          this._storageService.removeCurrentSession();
				}
			})
		);
	}

	refreshToken() {
		return this._httpService.post(this._refreshTokenUrl, {}).pipe(
			tap((response) => {
				if (response.success) {
          this._currentUserSubject.next(response.user);
          this._storageService.setCurrentSession(
            response.token,
            response.user.role,
            response.user
					);
				}
			})
		);
	}

	forgotPassword(json: ForgotPassword) {
		return this._httpService.post(this._forgotPasswordUrl, json);
	}

	resetPassword(token: string, json: ResetPassword) {
		this._storageService.setCurrentToken(token);
		return this._httpService.post(this._resetPasswordUrl, json);
	}

	hasRole(roles: string[]): boolean {
		return roles.includes(this.currentRole);
	}
}
