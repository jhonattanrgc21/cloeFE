import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatPaginatorIntl,
	MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomMatPaginatorIntl } from './core/constants/paginator-es';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
	declarations: [],
	exports: [
		MatPaginatorModule,
		MatTableModule,
		MatDialogModule,
		MatTooltipModule,
		MatTabsModule,
	],
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatTableModule,
		MatDialogModule,
		MatTooltipModule,
		MatTabsModule,
		MatTableModule,
	],
	providers: [
		{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
	],
})
export class MaterialModule {}
