import { Component, Input } from '@angular/core';
import { GatheringCenterCard } from '../../interfaces/gathering-center.interface';

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.scss']
})
export class LocationCardComponent {
	@Input() gatheringCenter!: GatheringCenterCard;
}
