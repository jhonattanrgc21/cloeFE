export interface GatheringCenterRegister {
	encargado_id: number;
	estado_id:    number;
	ciudad_id: number;
	description:  string;
	address:      string;
	name:        string;
}

export type GatheringCenterUpdate = Partial<GatheringCenterRegister> & {
	centro_id?: number;
	active?: number
}

export interface GatheringCenter {
	centro_id:   number;
	encargado:   Encargado;
	estado:      string;
	ciudad:      string;
	address:     string;
	name:        string;
	description: string;
	active:      number;
}

export interface Encargado {
	user_id: number;
	name:    string;
	cedula:  string;
}
