import { RaeeComponent } from "./raee-component.interface";

export interface Separation{
	id?: number;
	raeeId: number;
	components: RaeeComponent[];
}