export interface RaeeComponent {
	raee_name:    string;
	component_id: number;
	name:         string;
	weight:       number;
	dimensions:   string;
	reusable:     number;
	observations: string;
	materials:    string[];
	process:      string[];
}

export interface RaeeComponentEdit {
	component_id?: number;
	name?:         string;
	weight?:       number;
	dimensions?:   string;
	reusable?:     boolean;
	observations?: string;
	materials?:    number[];
	process?:      number[];
}
