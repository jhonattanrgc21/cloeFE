import { BrowserModule } from '@angular/platform-browser';
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

	constructor(private authService: AuthService){}

	ngOnInit(): void {
		this.fullName = this.authService.currentFullName;
		this.role = this.authService.currentRole;
	}

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

	toggleUserMenu(){
		this.isUserMenu = !this.isUserMenu;
	}
}
