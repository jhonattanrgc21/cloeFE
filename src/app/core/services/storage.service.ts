import { Injectable } from '@angular/core';
import {  UserSession } from 'src/app/auth/interfaces/current-user.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

	setCurrentSession(token: string, role: string ,currentUser?: UserSession | undefined | null): void {
		this.setCurrentToken(token);
		this.setCurrentRole(role);
		if(currentUser) this.setCurrentUser(currentUser);
  }

  removeCurrentSession(): void {
		this.clearCurrentToken();
		this.clearCurrentRole();
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

	getCurrentRole(): string {
    return localStorage.getItem('cloe-role') ?? '';
  }

  setCurrentRole(role: string): void {
    localStorage.setItem('cloe-role', role);
  }

  clearCurrentRole(): void {
    localStorage.removeItem('cloe-role');
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
