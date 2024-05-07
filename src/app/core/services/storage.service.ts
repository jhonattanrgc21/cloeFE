import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

	getCurrentToken(): string | null {
    return localStorage.getItem('token');
  }

  setCurrentToken(token: string): void {
    localStorage.setItem('token', token);
  }

  clearCurrentToken(): void {
    localStorage.removeItem('token');
  }

	getCurrentRole(): string | null {
    return localStorage.getItem('role');
  }

  setCurrentRole(role: string): void {
    localStorage.setItem('role', role);
  }

  clearCurrentRole(): void {
    localStorage.removeItem('role');
  }

  getUuid(): string | null {
    return localStorage.getItem('uuid');
  }

  setUuid(uuid: string): void {
    localStorage.setItem('uuid', uuid);
  }

  clearUuid(): void {
    localStorage.removeItem('uuid');
  }
}
