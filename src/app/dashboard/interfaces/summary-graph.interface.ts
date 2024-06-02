export interface SummaryGraph {
	raee_by_line_percent:   RaeeByLine[];
	raee_by_status: RaeeByStatus[];
	users_by_role_percent:  UsersByRole[];
}

export interface RaeeByLine {
	line_name:   string;
	raees_percentage: number;
}

export interface RaeeByStatus {
	status:      string;
	raees_count: number;
}

export interface UsersByRole {
	role:        string;
	users_percentage: number;
}
