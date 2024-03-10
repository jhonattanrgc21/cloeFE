import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomMatPaginatorIntl } from './core/paginator-es';
import { MatTableModule } from '@angular/material/table';

@NgModule({
	declarations: [],
	exports: [MatPaginatorModule, MatTableModule, MatDialogModule],
	imports: [CommonModule, MatPaginatorModule, MatTableModule, MatDialogModule],
	providers: [
		{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
	],
})
export class MaterialModule {}
