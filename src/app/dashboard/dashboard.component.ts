import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
	isSidebarOpen: boolean = false;
	rutaActual: string = '';

	constructor(private router: Router, private activatedRoute: ActivatedRoute) {
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
}
