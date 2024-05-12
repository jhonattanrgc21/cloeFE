import { CurrentUser } from './../interfaces/current-user.interface';
import { Login } from './../interfaces/login.interfce';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ForgotPassword } from '../interfaces/forgot-password.interface';
import { HttpHeaders } from '@angular/common/http';
import { ResetPassword } from '../interfaces/reset-password.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private logInUrl: string = 'auth/login';
	private logOutUrl: string = 'auth/logout';
	private refreshTokenUrl: string = 'auth/refresh-token';
	private forgotPasswordUrl: string = 'auth/forgot-password';
	private resetPasswordUrl: string = 'auth/reset-password';
	private currentUser!: CurrentUser;

  constructor(
		private storageService: StorageService,
		private httpService: HttpService
	) { }

	private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  }

	get currentToken(): string{
		return this.currentUser? this.currentUser.token: '';
	}

	get currentRole(): string{
		return this.currentUser? this.currentUser.role: '';
	}

	get currentFullName(): string{
		return this.currentUser? this.currentUser.fullName: '';
	}

	get currentUuid(): string{
		return this.currentUser? this.currentUser.uuid: '';
	}

	login(json: Login){
		return this.httpService.post(this.logInUrl, json).pipe(
			tap(response =>{
				if(response.success){
					this.currentUser = {
						token: response.token,
						role: response.role,
						uuid: response.user_id,
						fullName: response.full_name
					}
					this.storageService.setCurrentSession(this.currentUser);
				}
			})
		);
	}

	logout(){
		return this.httpService.post(this.logOutUrl, {}).pipe(
			tap(response => {
				if(response.success){
					this.currentUser = {
						token: '',
						role: '',
						uuid: '',
						fullName: ''
					}
					this.storageService.removeCurrentSession();
				}
			})
		)
	}

	refreshToken(){
		return this.httpService.post(this.refreshTokenUrl, {}).pipe(
			tap(response =>{
				if(response.success){
					this.currentUser = {
						token: response.token,
						role: response.role,
						uuid: response.user_id,
						fullName: response.full_name
					}
					this.storageService.setCurrentSession(this.currentUser);
				}
			})
		);
	}

	forgotPassword(json: ForgotPassword){
		return this.httpService.post(this.forgotPasswordUrl, json);
	}

	resetPassword(token: string, json: ResetPassword) {
		token = token.split(' ')[1];
		this.storageService.setCurrentToken(token);
		return this.httpService.post(this.resetPasswordUrl, json);
	}

	isTokenExpired(): boolean {
    const accessToken = this.storageService.getCurrentToken();
    if (!accessToken) return true;

    const tokenPayload = this.parseJwt(accessToken);
    const expirationDate = new Date(tokenPayload.exp * 1000);

    return expirationDate <= new Date();
  }
}
