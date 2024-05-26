import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	constructor(private _authService: AuthService){}

	getFullName(){
		return this._authService.currentFullName;
	}
}
