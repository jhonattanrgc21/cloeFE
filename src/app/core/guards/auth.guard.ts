import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	Router,
	RouterStateSnapshot,
	UrlSegment,
} from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

	constructor(private _authService: AuthService, private router: Router) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		if(!this._authService.currentToken){
      this.router.navigate(['/auth/sign-in']);
      return false;
		}

		return true;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		if(!this._authService.currentToken){
      this.router.navigate(['/auth/sign-in']);
      return false;
		}
		return true;
	}


	canLoad(
		route: Route,
		segments: UrlSegment[]
	): boolean {
		if(!this._authService.currentToken){
      this.router.navigate(['/auth/sign-in']);
      return false;
		}

		return true;
	}

}
