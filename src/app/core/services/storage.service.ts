import { Injectable } from '@angular/core';
import { CurrentUser } from 'src/app/auth/interfaces/current-user.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

	setCurrentSession(currentUser: CurrentUser): void {
		this.setCurrentToken(currentUser.token);
		this.setCurrentRole(currentUser.role);
		this.setCurrentFullName(currentUser.fullName);
		this.setUuid(currentUser.uuid);
  }

  removeCurrentSession(): void {
		this.clearCurrentToken();
		this.clearCurrentRole();
		this.clearCurrentFullName();
		this.clearUuid();
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

	getCurrentRole(): string | null {
    return localStorage.getItem('cloe-role');
  }

  setCurrentRole(role: string): void {
    localStorage.setItem('cloe-role', role);
  }

  clearCurrentRole(): void {
    localStorage.removeItem('cloe-role');
  }

	getCurrentFullName(): string {
    return localStorage.getItem('cloe-FullName') ?? '';
  }

  setCurrentFullName(fullName: string): void {
    localStorage.setItem('cloe-FullName', fullName);
  }

  clearCurrentFullName(): void {
    localStorage.removeItem('cloe-FullName');
  }


  getUuid(): string {
    return localStorage.getItem('cloe-uuid')?? '';
  }

  setUuid(uuid: string): void {
    localStorage.setItem('cloe-uuid', uuid);
  }

  clearUuid(): void {
    localStorage.removeItem('cloe-uuid');
  }
}
