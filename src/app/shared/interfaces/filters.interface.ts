export interface SelectFilter {
	filters: Filters;
}

export interface Filters {
	estado_id:    number | null;
	municipio_id?: number | null;
}