import { City } from "src/app/landing/interfaces/cities.interface";
import { State } from "src/app/landing/interfaces/states.interface";

export interface Manager{
	id: number;
	name: string;
}


export interface GatheringCenter{
	id: number;
	manager: Manager;
	description: string;
	state: State;
	city: City;
	address: string;
	status: string;
}

export type RegisterGatheringCenter = Pick<GatheringCenter, 'id' | 'description' | 'address'> & {
	managerId: number;
	stateId: number;
	cityId: number;
}
