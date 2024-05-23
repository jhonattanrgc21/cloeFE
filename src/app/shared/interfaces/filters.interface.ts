export interface SelectFilter {
	filters: Filters;
}

export interface Filters {
	estado_id:    number;
	municipio_id?: number;
}