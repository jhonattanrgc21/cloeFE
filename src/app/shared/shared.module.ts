import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloeInputFieldComponent } from './components/cloe-input-field/cloe-input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CloeSelectSearchComponent } from './components/cloe-select-search/cloe-select-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertComponent } from './components/alert/alert.component';




@NgModule({
	declarations: [CloeInputFieldComponent, CloeSelectSearchComponent, AlertComponent],
	exports: [CloeInputFieldComponent, CloeSelectSearchComponent, AlertComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgSelectModule
	]
})
export class SharedModule { }
