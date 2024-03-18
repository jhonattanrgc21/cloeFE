import { AlertService } from './../../services/alert.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() type: string = 'success';
  @Input() message: string = '';

  isVisible: boolean = true;

	constructor(private alertService: AlertService){}

	ngOnInit(): void {
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

	closeAlert(): void {
		this.alertService.setAlert({isActive: false, message: ''})
    this.isVisible = false;
  }
}
