import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgxMaskModule, IConfig  } from 'ngx-mask'
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { StorageService } from './services/storage.service';
import { HttpService } from './services/http.service';

export const customMaskConfig: Partial<IConfig>  = {
  validation: false,
  decimalMarker: ',',
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		HttpClientModule,
		NgxMaskModule.forRoot(customMaskConfig),
  ],
	providers: [
		HttpService,
		StorageService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class CoreModule { }