import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

	setCurrentSession(token: string, role: string, uuid: string): void {
		this.setCurrentToken(token);
		this.setCurrentRole(role);
		this.setUuid(uuid);
  }

  removeCurrentSession(): void {
		this.clearCurrentToken();
		this.clearCurrentRole();
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
