import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/core/constants';

@Component({
	selector: 'app-landing-header',
	templateUrl: './landing-header.component.html',
	styleUrls: ['./landing-header.component.scss'],
})
export class LandingHeaderComponent {
	isMenuOpen = false;

	constructor(private _router: Router) {}

	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
	}

	redirectToLogin() {
		this._router.navigateByUrl(ROUTES.login);
	}
}
