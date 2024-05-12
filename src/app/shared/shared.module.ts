import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { PaginatePipe } from './pipes/paginate.pipe';
import { CloeInputFieldComponent } from './components/cloe-input-field/cloe-input-field.component';
import { CloeSelectSearchComponent } from './components/cloe-select-search/cloe-select-search.component';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { DownloadPopupComponent } from './components/download-popup/download-popup.component';

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
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgSelectModule,
		NgxMaskModule.forChild(),
	],
})
export class SharedModule {}
