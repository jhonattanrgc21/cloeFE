import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomMatPaginatorIntl } from './core/paginator-es';


@NgModule({
  declarations: [],
	exports: [
		MatPaginatorModule,
	],
  imports: [
    CommonModule,
		MatPaginatorModule
  ],
	providers: [
		{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
	]
})
export class MaterialModule { }
