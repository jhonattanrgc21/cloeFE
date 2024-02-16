import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cloe-advantages',
  templateUrl: './cloe-advantages.component.html',
  styleUrls: ['./cloe-advantages.component.scss']
})
export class CloeAdvantagesComponent {
	@Input() icon:string = ''
	@Input() title:string = ''
	@Input() message:string = ''
}
