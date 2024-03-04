import { BrowserModule } from '@angular/platform-browser';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
	isUserMenu: boolean = false;
  @Output() sidebarToggled = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

	toggleUserMenu(){
		this.isUserMenu = !this.isUserMenu;
	}
}
