import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-raee-type-card',
  templateUrl: './raee-type-card.component.html',
  styleUrls: ['./raee-type-card.component.scss']
})
export class RaeeTypeCardComponent {
	@Input() icon:string = '';
	@Input() title:string = '';
}
