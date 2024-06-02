export interface SummaryGraph {
	raee_by_line:   RaeeByLine[];
	raee_by_status: RaeeByStatus[];
	users_by_role:  UsersByRole[];
}

export interface RaeeByLine {
	line_name:   string;
	raees_count: number;
}

export interface RaeeByStatus {
	status:      string;
	raees_count: number;
}

export interface UsersByRole {
	role:        string;
	users_count: number;
}