import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {
	constructor(private _authService: AuthService){}

	showOption(allowedRoles: string[]){
		return this._authService.hasRole(allowedRoles);
	}

	logout(){
		this._authService.logout().subscribe();
	}
}
