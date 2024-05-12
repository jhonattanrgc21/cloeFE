import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Login } from './../interfaces/login.interfce';
import { CurrentUser } from './../interfaces/current-user.interface';
import { ForgotPassword } from '../interfaces/forgot-password.interface';
import { ResetPassword } from '../interfaces/reset-password.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private _logInUrl: string = 'auth/login';
	private _logOutUrl: string = 'auth/logout';
	private _refreshTokenUrl: string = 'auth/refresh-token';
	private _forgotPasswordUrl: string = 'auth/forgot-password';
	private _resetPasswordUrl: string = 'auth/reset-password';
	private _currentUser!: CurrentUser;

  constructor(
		private _storageService: StorageService,
		private _httpService: HttpService
	) { }

	private _parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  }

	get currentToken(): string{
		return this._currentUser? this._currentUser.token: '';
	}

	get currentRole(): string{
		return this._currentUser? this._currentUser.role: '';
	}

	get currentFullName(): string{
		return this._currentUser? this._currentUser.fullName: '';
	}

	get currentUuid(): string{
		return this._currentUser? this._currentUser.uuid: '';
	}

	login(json: Login){
		return this._httpService.post(this._logInUrl, json).pipe(
			tap(response =>{
				if(response.success){
					this._currentUser = {
						token: response.token,
						role: response.role,
						uuid: response.user_id,
						fullName: response.full_name
					}
					this._storageService.setCurrentSession(this._currentUser);
				}
			})
		);
	}

	logout(){
		return this._httpService.post(this._logOutUrl, {}).pipe(
			tap(response => {
				if(response.success){
					this._currentUser = {
						token: '',
						role: '',
						uuid: '',
						fullName: ''
					}
					this._storageService.removeCurrentSession();
				}
			})
		)
	}

	refreshToken(){
		return this._httpService.post(this._refreshTokenUrl, {}).pipe(
			tap(response =>{
				if(response.success){
					this._currentUser = {
						token: response.token,
						role: response.role,
						uuid: response.user_id,
						fullName: response.full_name
					}
					this._storageService.setCurrentSession(this._currentUser);
				}
			})
		);
	}

	forgotPassword(json: ForgotPassword){
		return this._httpService.post(this._forgotPasswordUrl, json);
	}

	resetPassword(token: string, json: ResetPassword) {
		token = token.split(' ')[1];
		this._storageService.setCurrentToken(token);
		return this._httpService.post(this._resetPasswordUrl, json);
	}

	isTokenExpired(): boolean {
    const accessToken = this._storageService.getCurrentToken();
    if (!accessToken) return true;

    const tokenPayload = this._parseJwt(accessToken);
    const expirationDate = new Date(tokenPayload.exp * 1000);

    return expirationDate <= new Date();
  }
}
