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

	ngOnInit(): void {
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

	closeAlert(): void {
    this.isVisible = false;
  }
}
