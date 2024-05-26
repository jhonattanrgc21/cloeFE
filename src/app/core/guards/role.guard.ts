import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
	UrlTree,
	CanActivate,
} from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class RoleGuard implements CanActivate {
	constructor(private _authService: AuthService, private router: Router) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
    const expectedRole = route.data['expectedRoles'];
		if(!this._authService.hasRole(expectedRole)){
      this.router.navigate(['/dashboard/home']);
      return false;
		}
		return true;
	}
}
