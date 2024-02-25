import { City } from "./cities.interface";
import { State } from "./states.interface";

export interface GatheringCenter{
	id: number;
	city: City;
	state: State;
	address: string;
}