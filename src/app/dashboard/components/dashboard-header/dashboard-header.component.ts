import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit, OnDestroy {
	isUserMenu: boolean = false;
	fullName: string = '';
	role: string = '';
	letter: string = '';
  @Output() sidebarToggled = new EventEmitter<void>();
	private _authSubscription!: Subscription;

	constructor(private _authService: AuthService){
	}
	ngOnDestroy(): void {
		if(this._authSubscription) this._authSubscription.unsubscribe();
	}

	ngOnInit(): void {
		this._authSubscription = this._authService.currentUser$.subscribe(user => {
			this.fullName = user?  `${user.name} ${user.lastname}`: this._authService.currentFullName;
			this.role = user? user.role: this._authService.currentRole;
			this.letter = this.fullName[0];
    });
	}

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

	toggleUserMenu(){
		this.isUserMenu = !this.isUserMenu;
	}
}
