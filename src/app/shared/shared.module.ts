import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloeInputFieldComponent } from './components/cloe-input-field/cloe-input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CloeSelectSearchComponent } from './components/cloe-select-search/cloe-select-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertComponent } from './components/alert/alert.component';
import { PaginatePipe } from './pipes/paginate.pipe';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';

@NgModule({
	declarations: [
		CloeInputFieldComponent,
		CloeSelectSearchComponent,
		AlertComponent,
		PaginatePipe,
  ConfirmationPopupComponent,
	],
	exports: [CloeInputFieldComponent, CloeSelectSearchComponent, AlertComponent, PaginatePipe],
	imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
})
export class SharedModule {}
