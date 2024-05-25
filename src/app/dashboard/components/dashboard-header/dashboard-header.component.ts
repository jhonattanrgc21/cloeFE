import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
	isUserMenu: boolean = false;
	fullName: string = '';
	role: string = '';
  @Output() sidebarToggled = new EventEmitter<void>();

	constructor(private _authService: AuthService){
	}

	ngOnInit(): void {
		this._authService.getProfileInfo().subscribe(res => {
			this.fullName = this._authService.currentFullName;
			this.role = this._authService.currentRole;
		});
	}

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

	toggleUserMenu(){
		this.isUserMenu = !this.isUserMenu;
	}
}
