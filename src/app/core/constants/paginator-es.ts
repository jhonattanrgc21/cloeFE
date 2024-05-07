import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
	override itemsPerPageLabel: string = 'Items por página';
	override nextPageLabel: string = 'Siguiente';
	override previousPageLabel: string = 'Anterior';
	override firstPageLabel: string = 'Primera página';
	override lastPageLabel: string = 'Última página';

	constructor() {
		super();
	}

	override getRangeLabel = function (
		page: number,
		pageSize: number,
		length: number
	) {
		if (length === 0 || pageSize === 0) {
			return '0 de ' + length;
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;

		const endIndex =
			startIndex < length
				? Math.min(startIndex + pageSize, length)
				: startIndex + pageSize;
		return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
	};
}