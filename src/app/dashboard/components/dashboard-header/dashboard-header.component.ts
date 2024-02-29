import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  @Output() sidebarToggled = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggled.emit();
  }
}
