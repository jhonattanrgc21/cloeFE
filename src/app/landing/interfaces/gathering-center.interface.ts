import { City } from "./cities.interface";
import { State } from "./states.interface";

export interface GatheringCenter{
	id: number;
	city: City;
	state: State;
	address: string;
}

export interface GatheringCenterCard {
	centro_id:   number;
	estado:      string;
	ciudad:   string;
	address:     string;
	name:        string;
	description: string;
	active:      string;
}
