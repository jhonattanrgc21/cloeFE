import { CurrentUser } from './../interfaces/current-user.interface';
import { Login } from './../interfaces/login.interfce';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private logInUrl: string = 'auth/login';
	private logOutUrl: string = 'auth/logout';
	private refreshTokenUrl: string = 'auth/refresh-token';
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


	login(input: Login){
		return this.httpService.post(this.logInUrl, input).pipe(
			tap(response =>{
				if(response.success){
					this.currentUser = {
						token: response.token,
						role: response.role,
						uuid: response.user_id,
						fullName: ''
					}
					this.storageService.setCurrentSession(response.token, response.role, response.user_id);
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
						fullName: ''
					}
					this.storageService.setCurrentSession(response.token, response.role, response.user_id);
				}
			})
		);
	}

	isTokenExpired(): boolean {
    const accessToken = this.storageService.getCurrentToken();
    if (!accessToken) return true;

    const tokenPayload = this.parseJwt(accessToken);
    const expirationDate = new Date(tokenPayload.exp * 1000);

    return expirationDate <= new Date();
  }
}
