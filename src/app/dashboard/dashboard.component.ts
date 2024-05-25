import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Subscription, filter, map } from 'rxjs';
import { AlertService } from './../shared/services/alert.service';
import { Alert } from '../shared/interfaces/alert.interface';
import { AuthService } from '../auth/services/auth.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	// TODO: agregar un metodo getProfile
	isSidebarOpen: boolean = false;
	rutaActual: string = '';
	alertObj!: Alert;
	private _alertSubscription!: Subscription;

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _alertService: AlertService,
		private _viewportRuler: ViewportRuler,
		private _authService: AuthService
	) {
		this._router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this._activatedRoute),
				map((route) => {
					while (route.firstChild) {
						route = route.firstChild;
					}
					return route;
				}),
				filter((route) => route.outlet === 'primary'),
				map((route) => route.snapshot.url.join('/'))
			)
			.subscribe((url: string) => {
				this.rutaActual = url;
			});
	}

	ngOnInit(): void {
		//this._authService.getProfileInfo().subscribe();
		this._alertSubscription = this._alertService.alert$.subscribe(
			(alert: Alert) => {
				this.alertObj = alert;
			}
		);
	}

	obtenerMensaje(): string {
		let headerMessage: string = '';
		switch (this.rutaActual) {
			case 'summary':
				headerMessage = '¡Bienvenido!';
				break;
			case 'gathering-centers':
				headerMessage = 'Centros de acopio';
				break;
			case 'users':
				headerMessage = 'Usuarios';
				break;
			case 'clasification':
				headerMessage = 'Clasificar';
				break;
			case 'separation':
				headerMessage = 'Separar';
				break;
		}
		return headerMessage;
	}

	onSidebarToggle() {
		this.isSidebarOpen = !this.isSidebarOpen;
	}

	onSidebarToggle2() {
		const viewportSize = this._viewportRuler.getViewportSize();
		if( viewportSize.width < 1024 && this.isSidebarOpen) this.isSidebarOpen = false;
	}

	ngOnDestroy(): void {
		if (this._alertSubscription) {
			this._alertSubscription.unsubscribe();
		}
	}
}
