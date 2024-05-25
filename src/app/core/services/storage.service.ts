import { Injectable } from '@angular/core';
import {  UserSession } from 'src/app/auth/interfaces/current-user.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

	setCurrentSession(token: string, currentUser?: UserSession | undefined | null): void {
		this.setCurrentToken(token);
		if(currentUser) this.setCurrentUser(currentUser);
  }

  removeCurrentSession(): void {
		this.clearCurrentToken();
		this.clearCurrentUser();
  }


	getCurrentToken(): string {
    return localStorage.getItem('cloe-token') ?? '';
  }

  setCurrentToken(token: string): void {
    localStorage.setItem('cloe-token', token);
  }

  clearCurrentToken(): void {
    localStorage.removeItem('cloe-token');
  }

	getCurrentUser(): UserSession | null {
		const user: string | null = localStorage.getItem('cloe-user');
		const userSession: UserSession | null =  user ? JSON.parse(user): '';
    return userSession;
  }

  setCurrentUser(currentUser: UserSession | null | undefined): void {
    localStorage.setItem('cloe-user', JSON.stringify(currentUser));
  }

  clearCurrentUser(): void {
    localStorage.removeItem('cloe-user');
  }

}
