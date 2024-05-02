import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloeInputFieldComponent } from './components/cloe-input-field/cloe-input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CloeSelectSearchComponent } from './components/cloe-select-search/cloe-select-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertComponent } from './components/alert/alert.component';
import { PaginatePipe } from './pipes/paginate.pipe';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { DownloadPopupComponent } from './components/download-popup/download-popup.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
	declarations: [
		CloeInputFieldComponent,
		CloeSelectSearchComponent,
		AlertComponent,
		PaginatePipe,
		ConfirmationPopupComponent,
		DownloadPopupComponent,
	],
	exports: [
		CloeInputFieldComponent,
		CloeSelectSearchComponent,
		AlertComponent,
		PaginatePipe,
		ConfirmationPopupComponent,
		DownloadPopupComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgxMaskModule.forChild()],
})
export class SharedModule {}
