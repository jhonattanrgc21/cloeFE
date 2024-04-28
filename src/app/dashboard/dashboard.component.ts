import { AlertService } from './../shared/services/alert.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { Alert } from '../shared/interfaces/alert.interface';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	isSidebarOpen: boolean = false;
	rutaActual: string = '';
	alertObj!: Alert;
	private alertSubscription!: Subscription;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private alertService: AlertService,
		private _viewportRuler: ViewportRuler,
	) {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
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
		this.alertSubscription = this.alertService.alert$.subscribe(
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
		if (this.alertSubscription) {
			this.alertSubscription.unsubscribe();
		}
	}
}
